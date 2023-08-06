

module.exports =  (sequalize, DataTypes) =>{
    const Discountuser = sequalize.define('discountuser',{
        discount_id:{
            type:DataTypes.INTEGER
        },
       user_id:{
           type:DataTypes.INTEGER
       },
       customer_id:{
        type:DataTypes.INTEGER
      },
        user_type:{
            type: DataTypes.STRING
        },
        discount_type:{
            type: DataTypes.STRING
        },
        created_by:{
            type:DataTypes.STRING
        },
        isactive:{
            type: DataTypes.BOOLEAN,
            defaultValue:1
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'discount_id','user_type','discount_type','customer_id'],
                name:'unique_discount_user'
            },
           
        ]
    }
    )

    return Discountuser;
}