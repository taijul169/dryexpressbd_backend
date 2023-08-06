const db = require('../models')

//const { products } = require('../models');
// create main Model
const Order = db.orders
const Orderstatus = db.orderstatus  



// main work

// 1. create Shop

const addAccept = async (req,res)=>{
    try {
        const newcode =  Math.floor(100000 + Math.random() * 900000);
        let info ={
            pickupdate:req.body.pickupdate,
            pickuptime:req.body.pickuptime,
            deliveryboyid:req.body.deliveryboyid,
            order_id: req.body.order_id,
            currentstatus:req.body.status,
            reason:req.body.reason,
            estimatedtime:req.body.estimatedtime,
            securitycode:newcode,
        }
        const orderstatus = await Orderstatus.create(info)
        res.status(200).send({orderstatus,code:201,msg:'success'})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:'Bad Request!!' ,error})
    }
    
}

// get order status by order id

const getOrderStatus = async (req,res)=>{
    let orderstatus =  await Orderstatus.findOne({
        where:{order_id:req.params.order_id}
        })
        res.status(200).send(orderstatus)
}





//  get single order by order id





// order statusupdate
const orderStatusUpdate = async(req,res) =>{
    const order_id  =  req.params.order_id;
    const status  =  req.params.status;
    console.log("order id",order_id)
    if(status == 'ReadyToDelivered'){
        const newcode =  Math.floor(100000 + Math.random() * 900000);
        const orderstatus =  await Orderstatus.update({currentstatus:status,securitycodedelivered:newcode},{where:{order_id}})
        res.status(200).send({orderstatus,code:200,msg:'success'})
    }else{
        const orderstatus =  await Orderstatus.update({currentstatus:status},{where:{order_id}})
        res.status(200).send({orderstatus,code:200,msg:'success'})
    }
    
    
    //console.log(product)
}

// order statusupdate
const orderStatusUpdateforcancel = async(req,res) =>{
    const order_id  =  req.params.order_id;
    const status  =  req.params.status;
    const orderstatus =  await Orderstatus.update({currentstatus:status,reason:req.body.reason},{where:{order_id}})
    console.log("orders staus:",orderstatus)
    res.status(200).send({orderstatus,code:200,msg:'success'})
    //console.log(product)
}

module.exports ={
    addAccept,
    orderStatusUpdate,
    getOrderStatus,
    orderStatusUpdateforcancel
}