

const getTime =  ()=>{
    const d = new Date();
    let time = d.getTime();
    return time
}

module.exports =  (sequelize, DataTypes) =>{
    const Order = sequelize.define('order',{
        firstname:{
            type:DataTypes.STRING,
        },
        lastname:{
            type:DataTypes.STRING,
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:false
        },
        address:{
            type: DataTypes.TEXT
        },
        area:{
            type: DataTypes.TEXT
        },
        city:{
            type: DataTypes.TEXT
        },
        isactive:{
            type:DataTypes.BOOLEAN
        },
        isdelivered:{
            type:DataTypes.BOOLEAN
        },
        paymentmethod:{
            type:DataTypes.STRING
        },
        deliverycharge:{
          type:DataTypes.INTEGER
        },
        total:{
            type:DataTypes.INTEGER
        },
        user_id:{
           
            type:DataTypes.INTEGER
        },
        shop_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        currentstatus:{
            type:DataTypes.TEXT,
            defaultValue: "Pending",
        },
        created_Time:{
          type:DataTypes.STRING,
          defaultValue:getTime(),
          allowNull:false
        },
        profitamount:{
            type:DataTypes.INTEGER
        },
        paymentstatus:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        discount_id:{
            type:DataTypes.INTEGER
        },
        contributed_percent:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        contributed_profit_admin:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        isdiscounted:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        ispaidtolaundry:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        ispaidtodryexpress:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        pendingTimewithDate:{ 
            type:DataTypes.STRING,
            defaultValue:null
        },
        profitamountglobal:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        grand_total:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        
        
    })

    return Order;
}