const db = require('../models')

// create main Model

const Membership = db.memberships


// 1.create membershp 

const createMembership =  async(req,res)=>{
    try {
        let info = {
            vat_percent:req.body.vat_percent,
            coupon_percent:req.body.coupon_percent,
            membership_percent:req.body.membership_percent,
            isVatAllow:req.body.isVatAllow,
            isCouponAllow:req.body.isCouponAllow,
            isMembershipAllow:req.body.isMembershipAllow,
        }
        const membershipdata = await Membership.create(info)
        res.status(201).send({
            code:201,
            data:membershipdata,
            msg:'Create Successfully'
        })
    } catch (error) {
        res.status(400).send({
            code:400,
            data:membershipdata,
            msg:'Invalid Input'
        })
    }
    
}

// get single membership data
const getSingleMembershipData =  async(req,res)=>{
    try {
      const  membershipdata = await Membership.findOne({
          where:{
              isActive:true
          }
      })
      res.status(200).send(membershipdata)
    } catch (error) {
        res.status(400).send({error})
    }
}

// get single membership data
const getAllMembershipData =  async(req,res)=>{
    try {
      const  membershipdata = await Membership.findAll()
      res.status(200).send(membershipdata)
    } catch (error) {
        res.status(400).send({error})
    }
}
// 3.update single membership update
const updatesinglemembership = async(req,res)=>{
    try { 
        let info = {
            vat_percent:req.body.vat_percent,
            coupon_percent:req.body.coupon_percent,
            membership_percent:req.body.membership_percent,
            isMembershipAllow:req.body.isMembershipAllow,
            isCouponAllow:req.body.isCouponAllow,
            isVatAllow:req.body.isVatAllow,
            id:req.body.id,
            isActive:req.body.isActive
        }
        const updatedData =  await Membership.update(info,{
            where:{
                id:info.id
            }
        })
        res.status(200).send({
            code:200,
            msg:'Updated Successfully',
            data:updatedData
        })

    } catch (error) {
        res.status(400).send({error})
    }
}


// const delete item by id

const deleteitembyid = async(req,res)=>{
    try {
        const deletingData =  await Membership.destroy({
            where:{
                id:req.params.id
            }
        })
        res.status(200).send({
            code:200,
            msg:'Deleted Succssfully'
        })
    } catch (error) {
        res.send({error})
        console.log("error",error)
    }
   
}


module.exports ={
    createMembership,
    getSingleMembershipData,
    updatesinglemembership,
    getAllMembershipData,
    deleteitembyid
    
}