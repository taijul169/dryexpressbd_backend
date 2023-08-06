
const getTime =  ()=>{
    const d = new Date();
    let time = d.getTime();
    return time
}
module.exports =  (sequalize, DataTypes) =>{
    const Notification = sequalize.define('notification',{
       
        heading:{
            type:DataTypes.STRING
        },
        body:{
            type: DataTypes.TEXT
        },
        user_type:{
            type: DataTypes.STRING,
            allowNull:false

        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            defaultValue:null
        },
        created_Time:{
            type:DataTypes.STRING,
            defaultValue:getTime(),
            allowNull:false
          },
        viewed:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        shop_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            defaultValue:null
        },
        order_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            defaultValue:null
        },
        discount_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            defaultValue:null
        },
        noti_type:{
            type: DataTypes.STRING,
            allowNull:true
        },
        order_status:{
            type: DataTypes.STRING,
            allowNull:true
        },
          
       
    })

    return Notification;
}