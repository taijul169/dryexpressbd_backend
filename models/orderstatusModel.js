
module.exports =  (sequalize, DataTypes) =>{
    const Orderstatus = sequalize.define('orderstatus',{
        pickupdate:{
            type:DataTypes.STRING
        },
        pickuptime:{
            type:DataTypes.STRING
        },
        deliveryboyid:{
            type: DataTypes.INTEGER
        },
        currentstatus:{
            type: DataTypes.STRING
        },
        order_id:{
          type:DataTypes.INTEGER,
          unique:true
        },
        reason:{
            type:DataTypes.STRING
        },
        estimatedtime:{
            type:DataTypes.STRING
        },
        pickeduptimewithdate:{
            type:DataTypes.STRING
        },
        deliveredtimewithdate:{
            type:DataTypes.STRING
        },
        ispickedupconfirmedbycustomer:{
            type:DataTypes.BOOLEAN
        },
        isdeliveredconfirmedbycustomer:{
            type:DataTypes.BOOLEAN
        },
        securitycode:{
            type:DataTypes.INTEGER
        },
        securitycodedelivered:{
            type:DataTypes.INTEGER
        },
        readytodeliveredtime:{
            type:DataTypes.STRING
        },
        receivedtime:{
            type:DataTypes.STRING
        },                                                                                                   
        
       
    })

    return Orderstatus;
}