

module.exports =  (sequalize, DataTypes) =>{
    const Discount = sequalize.define('discount',{
       user_id:{
           type:DataTypes.INTEGER
       },
        user_type:{
            type: DataTypes.STRING
        },
        discount_percent:{
            type: DataTypes.INTEGER
        },
        discount_type:{
            type: DataTypes.STRING
        },
        name:{
            type: DataTypes.STRING
        },
        created_by:{
            type:DataTypes.STRING
        },
        isactive:{
            type: DataTypes.BOOLEAN,
            defaultValue:1
        },
        expired_in:{
            type: DataTypes.STRING
        },
        iscontributed:{
            type: DataTypes.BOOLEAN,
            defaultValue:0
        },
        contribution_percent:{
            type: DataTypes.INTEGER,
           
        },
        

    }
    
    )

    return Discount;
}