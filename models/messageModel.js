
const getTime =  ()=>{
    const d = new Date();
    let time = d.getTime();
    return time
}
module.exports =  (sequalize, DataTypes) =>{
    const Message = sequalize.define('message',{
       
        message:{
            type:DataTypes.TEXT
        },
        user_type:{
            type: DataTypes.STRING,

        },
        customer_id:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        shop_id:{
            type: DataTypes.INTEGER,
            allowNull:false
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
        receiver:{
            type:DataTypes.STRING,
        }   
       
    })

    return Message;
}