const db = require('../models')


const Review = db.reviews
const Customer = db.customers
const Shop = db.shops
const Paymenthistory =  db.paymenthistory
// function



// 1. add payment 
const addPayment =  async (req,res)=>{
    try {
        let data = {
            customer_id:req.body.customer_id,
            shop_id:req.body.shop_id,
            order_id:req.body.order_id,
            total_amount:req.body.total_amount,
            provider:req.body.provider,
            paymentstatus:req.body.paymentstatus?req.body.paymentstatus:null,
            tran_id:req.body.tran_id,
            error:req.body.error,
            bank_tran_id:req.body.bank_tran_id,
            status:req.body.status,
            verify_sign:req.body.verify_sign,
            message:req.body.message,
            tran_date:req.body.tran_date
        }
        const payment =  await Paymenthistory.create(data)
        res.status(201).send({msg:'success',data:payment,code:201})
    } catch (error) {
        console.log("errr",error)
        res.status(400).send({msg:'failed',code:400})
    }
   
}

// get all payment history 
const getallpaymenthistory =  async (req,res)=>{
    const payment =  await Paymenthistory.findAll()
    res.status(200).send({msg:'success',data:payment,code:200})

}

// get all payment history by shop id
const getapppaymenthistorybyshopid =  async (req,res)=>{
    const payment = await Paymenthistory.findAll({where:{
        shop_id:req.query.shopid
    }})
    res.status(200).send({msg:'success',data:payment,code:200})
}


// get all payment history by  order id
const getapppaymenthistorybyorderid =  async (req,res)=>{
    const payment = await Paymenthistory.findAll({where:{
        order_id:req.query.orderid
    }})
    res.status(200).send({msg:'success',data:payment,code:200})
}

// get all payment history by  customer id
const getapppaymenthistorybycustomerid =  async (req,res)=>{
    const payment = await Paymenthistory.findAll({where:{
        customer_id:req.query.customerid
    }})
    res.status(200).send({msg:'success',data:payment,code:200})
}

module.exports = {
    addPayment,getallpaymenthistory,getapppaymenthistorybyshopid,getapppaymenthistorybyorderid,getapppaymenthistorybycustomerid
}
    
