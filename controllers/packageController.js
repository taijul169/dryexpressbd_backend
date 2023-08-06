const db = require('../models')
const sequelize = require('sequelize')

// create main Model
const Package = db.packages

// main work

// 1. create product
const addPackageitem = async (req,res)=>{
    let info ={
        title:req.body.title,
        numberofitem:req.body.numberofitem,
        price:req.body.price,
        description:req.body.description,
        isactive:req.body.isactive ? req.body.isactive :true,
    }

    const product = await Package.create(info)
    res.status(200).send(product)

    console.log(product)
}


// 2 get all products

const getAllPackageitem = async (req,res) =>{
    let products =  await Package.findAll({
     
    })
     res.status(200).send(products)

    console.log(products)
}


// 3 get single product
const getOneItem = async (req,res) =>{

    let id = req.params.id
    let product =  await Package.findOne({
     where:{id:id}
    })
     res.status(200).send(product)

    console.log(product)
}

// 4 single product update

const updateItem = async (req,res) =>{

    let id = req.params.id
    const product = await Package.update(req.body,{where:{id:id}})
    res.status(200).send(product)
    console.log(product)
}

// 5 delete product by id

const deleteItem = async (req,res) =>{

    let id = req.params.id
   await Package.destroy({where:{id:id}})
     res.status(200).send("Product is deleted")

}

// 6 get published product 

const getActiveItem = async (req,res) =>{

   
   const products =  await Package.findAll({
       where:{isactive:true}
   })

   res.status(200).send(products)

}


const getSumofPrice  = async (req,res) =>{
    const totalAmount = await Package.findAll({
        attributes: [
          'id',
          [sequelize.fn('sum', sequelize.col('price')), 'total_amount'],
        ]
        
      });

      res.status(200).send(totalAmount)
}



// 7. connect one to many relation Product and reviews
// const getProuductReviews  =  async (req,res) =>{
//     let id =  req.params.id
//     const data = await Product.findAll({
//        include:[{
//            model:Review,
//            as:'review'
//        }],
//        where: {id:id}
//     })

//     res.status(200).send(data)
// }


module.exports ={
    addPackageitem,
    getAllPackageitem,
    getOneItem,
    updateItem,
    getActiveItem,
    deleteItem,
    getSumofPrice
    
}