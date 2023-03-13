'use strict';
const stripe = require('stripe')(process.env.STRIPE_KEY);
const unparsed = require("koa-body/unparsed.js");
// const { default: createStrapi } = require('strapi');
const endpointSecret = "whsec_D9dlqxiWXFj33AERgNnaj6dWpvCIlN6u"; 

module.exports = {
  exampleAction: async( ctx ) => {
    const sig = await ctx.request.headers["stripe-signature"]
    const body = await ctx.request.body[unparsed]
    try {

      const returnRefundedPayment = async( body ) => {

        try {
          if(!body){
            console.log('ctx req body is missing')
            throw new Error('ctx req body is missing')
          }

          const event = await stripe.webhooks.constructEvent(
            await body,
            sig,
            endpointSecret
          )
          
          const refundedPayment = ( await event.data.object.status === 'succeeded' ) && await event.data.object
          
          console.log(event)

          return refundedPayment

        } catch (error) {
          console.log(error)
          return error
        }
      }

      const getRefundedOrder = async(refundedPayment) => {

        try {
          if(!refundedPayment){
            return ctx = { status: 404, body: { error: "Order is not catogrized as Refunded on Strapi record, because Refunded Payment data is missing !" } };
          }

          const refundedOrder = await strapi.db.query('api::order.order').findOne({
            filters: {stripeID: await refundedPayment.payment_intent},
          })

          return refundedOrder

        } catch (error) {
          console.log(error)
          return error
        }
      }

      const getRedundedOrderID = async(refundedOrder) =>{

        try {
          if(!refundedOrder){
            return ctx = { status: 404, body: { error: "Order is not catogrized as Refunded on Strapi record, because Refunded Order data is missing !" } };
          }

          const refundedOrderID = await refundedOrder.id
          return refundedOrderID
        } catch (error) {
          console.log(error)
          return error
        }
      }

      const getPreviousRefundedPayments = async() => {
        try {
          const previouslyRefundedPayments = await strapi.db.query("api::refunded-and-cancelled.refunded-and-cancelled").findMany({populate: {orders: true}})
          return previouslyRefundedPayments
        } catch (error) {
          console.log(error)
          return error
        }
      }
      const getPreviousRefundedPaymentsIDs = async(previouslyRefundedPayments) => {

        try {
          if(!previouslyRefundedPayments){
            return ctx = { status: 404, body: { error: "Order is not catogrized as Refunded on Strapi record, because previously Refunded Paymentsis is missing !" } };
          }

          const previouslyRefundedPaymentsIDs = await previouslyRefundedPayments.length === 0 ? [] : await previouslyRefundedPayments[0]?.orders?.map((order) => ({id: order.id}))
          return previouslyRefundedPaymentsIDs
        } catch (error) {
          console.log(error)
          return error
        }
      }
      const addNewIDToAllIDs = async(refundedOrderID, previouslyRefundedPaymentsIDs) => {
        try {
          if(!refundedOrderID){
            return ctx = { status: 404, body: { error: "Order is not catogrized as Refunded on Strapi record, because failed to get Refunded Order ID when concatinating it to the all ID array !" } };
          }
          if(!previouslyRefundedPaymentsIDs){
            return ctx = { status: 404, body: { error: "Order is not catogrized as Refunded on Strapi record, because failed to get previously Refunded Orders IDs when concatinating Refunded Order ID to it !" } };
          }
          
          const unifiedArrayOfIDs = await previouslyRefundedPaymentsIDs.concat({id: refundedOrderID})
          return unifiedArrayOfIDs
        } catch (error) {
          console.log(error)
          return error
        }
      }

      const updateListOfRefundedPayments = async(unifiedArrayOfIDs) => {

        try {
          if(!unifiedArrayOfIDs) {
            throw new Error('no array of Payments IDs to Update the refunded-and-cancelled list on Strapi !')
          }
          const updatedListOfRefundedPayments = await strapi.db.query("api::refunded-and-cancelled.refunded-and-cancelled").update({
            where: {id: 1},
            data: {orders: await unifiedArrayOfIDs}
          })
          return updatedListOfRefundedPayments
        } catch (error) {
          console.log(error)
          return error
        }
      }

      const refundedPayment = await returnRefundedPayment(await body)

      const refundedOrder = await getRefundedOrder(await refundedPayment)
      const refundedOrderID = await getRedundedOrderID(await refundedOrder)
      
      const previouslyRefundedPayments = await getPreviousRefundedPayments()
      const previouslyRefundedPaymentsIDs = await getPreviousRefundedPaymentsIDs(await previouslyRefundedPayments)

      const unifiedArrayOfIDs = await addNewIDToAllIDs( await refundedOrderID, await previouslyRefundedPaymentsIDs )
      const updatedListOfRefundedPayments = await updateListOfRefundedPayments( await unifiedArrayOfIDs )

      if(updatedListOfRefundedPayments){
        return await refundedOrder
      }else{
        return new Error('failed to accomplish')
      } 
    } catch (error) {
      console.log(error)
      return error
    }
  }
};
