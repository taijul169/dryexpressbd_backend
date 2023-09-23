
const db = require('../models')

// create main Model

const RegiCode = db.registrationcodes

const Accounts = db.accounts
const Orders = db.orders
const Shop = db.shops

// main work
// add account

const addAccount = async(req,res)=>{
    try {
        let info ={
            amount:req.body.amount,
            paidtolaundry:req.body.paidtolaundry?req.body.paidtolaundry:false,
            confirmedbylaundry:req.body.confirmedbylaundry?req.body.confirmedbylaundry:false,
            shop_id:req.body.shop_id,
            paymentmethod:req.body.paymentmethod,
            orderid:req.body.orderid
        }
        const account = await Accounts.create(info)
        res.status(201).send({data:account,code:201,msg:'Accounts created'}) 
    } catch (error) {
        console.log("error",error)
    }
    
}



// get all accounts
const getAllAccounts = async (req,res)=>{
  const accounts  = await Accounts.findAll()
  res.send(accounts)
}
// get all accounts by shop id
const getAllAccountsbyshopid = async (req,res)=>{
    const account  = await Accounts.findAll({
        where:{
            shop_id:req.params.shopid
        }
    })
    res.send(account)
  }


const updateAccountsbyshop = async (req,res)=>{
    const accountupdate =  await Accounts.update({confirmedbylaundry:true,},{where:{
       shop_id:req.params.shopid,
       id:req.body.id
    }})
    res.status(200).send({msg:'updated successfully',code:200,accountupdate})
}  

// get single account with deatils

const getsingletransaction = async(req,res)=>{
    const transaction =  await Accounts.findOne({
        include:[
       
            {
                model:Shop,
                as:'shop',
                required:false
            },
            
        ],
        where:{
            id:req.params.id
        },
    })


    let orderid =  JSON.parse(transaction.orderid)
  const orders =  await  Orders.findAll({
        where:{
            id:orderid
        }

    })
    res.status(200).send({transaction,orders})
}

// get all transaction by shop id
const getAllAccountsByShopID = async (req,res)=>{
    let condition={

    }
    if(req.query.status == 'true'){
        condition.shop_id=req.query.shopid
        condition.confirmedbylaundry = true
    }
    if(req.query.status == 'false'){
      condition.shop_id=req.query.shopid
      condition.confirmedbylaundry = false
    }
    if(req.query.status == 'all'){
        condition.shop_id=req.query.shopid
    }
    
    const accounts  = await Accounts.findAll({
        where:condition
    })
    res.status(200).send(accounts)
  }

  
// get transaction by status

module.exports ={
    addAccount,
    getAllAccounts,
    getAllAccountsbyshopid,
    updateAccountsbyshop ,
    getsingletransaction ,
    getAllAccountsByShopID,
 
    
}