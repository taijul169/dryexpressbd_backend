const db = require('../models')

const Notification = db.notifications
// function
// 1.add review
const addNotification = async(req,res)=>{
  let data = {
      heading:req.body.heading,
      body:req.body.body,
      user_type:req.body.user_type,
      user_id:req.body.user_id,
      order_status:req.body.order_status?req.body.order_status:'pending'
  }


  const notification = await Notification.create(data)
  res.status(200).send(notification)
}

// 2.Get all notifications
const getAllNotification =  async (req,res) =>{

     // fetching data with pagination
     const getPagination = (page, size) => {
        const limit = size ? +size : 5;
        //const offset = page ? page * limit : 0;
        const offset = page * limit
        return { limit, offset };
    };

    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: notifications } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, notifications, totalPages, currentPage };
    };

    const { page, size,user_id,user_type } = req.query;
    var condition= {}
    if(user_type == 'shop'){
        var condition = {shop_id:user_id,user_type:user_type};
    }
    if(user_type == 'customer'){
        var condition = {user_id:user_id,user_type:user_type};
    }  
   

    const { limit, offset } = getPagination(page, size);
    // const user_id = req.params.user_id
    // const user_type = req.params.user_type

    Notification.findAndCountAll({ 
        where: condition, limit, offset,
        order: [
            
            ['id', 'DESC'],
           
        ]
    })
    .then(data => {
        const response = getPagingData(data, page, limit);
        const a = parseInt(response.totalPages)
        const b = parseInt(page)+1
       
         if(a>b){
            //console.log("true")
            response.vieweditems = (response.currentPage+1)*size;  
        }else{
            response.vieweditems = response.totalItems
        }
        res.send(response);
    })
    .catch(err => {
        res.status(200).status(500).send({
        message:
            err.message || "Some error occurred while retrieving Shops."
        });
    });
}
// 2.Get all notification by userid and user type
const getAllNotificationByUseridAndUserType=  async (req,res) =>{
    const user_id = req.params.user_id
    const user_type = req.params.user_type
    const status = req.params.status
    console.log("user_id",user_id)
    const notifications =  await Notification.findAll({
        where:{user_id:user_id,user_type:user_type,viewed:status},
        order: [
            
            ['id', 'DESC'],
           
        ]
     }
    )
    res.status(200).send(notifications)
}

// notification statusupdate
const notificationStatusUpdate = async(req,res) =>{
    const notification_id  =  req.params.notification_id;
    const status  =  req.params.status;
    const notification =  await Notification.update({viewed:status},{where:{id:notification_id}})
    res.status(200).send({notification,code:200,msg:'success'})
    //console.log(product)
}
// 2.Get all notifications
const getAllNotificationBystatus =  async (req,res) =>{
    const notifications =  await Notification.findAll({where:{viewed:req.params.status}})
    res.status(200).send(notifications)
}

// 2.Get all notifications
const getSingleNotification =  async (req,res) =>{
    const notification =  await Notification.findAll({where:{id:req.params.notification_id}})
    res.status(200).send(notification)
}

// notification statusupdate
const notificationStatusUpdateforAllbyuseridandtype = async(req,res) =>{
    const user_id = req.params.user_id
    const user_type = req.params.user_type
    const status  =  true;
    const notification =  await Notification.update({viewed:status},{where:{user_id:user_id,user_type:user_type}})
    res.status(200).send({notification,code:200,msg:'success'})
    //console.log(product)
}
// 2.Get all Reviews by user id
module.exports = {
    getAllNotificationByUseridAndUserType,
    getAllNotification,
    addNotification,
    notificationStatusUpdate,
    getAllNotificationBystatus,
    getSingleNotification,
    notificationStatusUpdateforAllbyuseridandtype
}
    
