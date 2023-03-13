'use strict';
const stripe = require('stripe')(process.env.STRIPE_KEY);
const unparsed = require("koa-body/unparsed.js");
const sdk = require('api')('@easyship/v2022.10#dhgnhmld00bc4w');
/**
 * A set of functions called "actions" for `stripeHook`
 */
const endpointSecret = "whsec_BoBDIdevpOQfd3ZvLEcwtqqvAvlbLtzX"; 

sdk.auth('prod_9Upez/Wn/Z5NJeH5DD9dJU5Mt7u8/mRvAn7Wq7+CVHM=');

module.exports = {
  webhook: async (ctx) => {
    try {     
      // Verify the webhook event
      const sig = await ctx.request.headers["stripe-signature"]
      const body = await ctx.request.body[unparsed]

      const createStripeEvent = async(body) => {
        
        if(!body){
          throw new Error ('req.body || data is required for creating webhook Event')
        }
        try {          
          const event = await stripe.webhooks.constructEvent(
            await body,
            sig,
            endpointSecret
          );
          return event
        } catch (error) {
          console.log(error) 
        }
      }

      const createOrderUponPaymentSuccess = async(event) => {
        if(!event){
          throw new Error ('webhook Event is required for creating Payload for creating shipment')
        }
        if(await event.data?.object?.payment_status === 'paid'){
          const prods = await JSON.parse(event.data.object.metadata.products)
          const products = prods.map((p) => {
            return{              
              __component: "order-products.ordered-products",
              Product_name: `${p.price_data.product_data.name}`,
              currency: `${p.price_data.currency}`,
              unit_price: p.price_data.unit_amount / 100,
              order_quantity: p.quantity            
            }
          })
          try {
            const newOrder = await strapi.service('api::order.order').create({
              data:{
                stripeID: `${await event.data.object.payment_intent}`,
                Buyer_name: `${await event.data.object.customer_details.name}`,
                Buyer_email: `${await event.data.object.customer_details.email}`,
                Buyer_phone_number: `${await event.data.object.customer_details.phone}`,
                currency: `${await event.data.object.currency.toUpperCase()}`,
                Shipping_address: `${await event.data.object.shipping_details.address.line1}, ${await event.data.object.shipping_details.address.state}, ${await event.data.object.shipping_details.address.city}, ${await event.data.object.shipping_details.address.postal_code},${await event.data.object.shipping_details.address.country}`,
                publishedAt: new Date(),     
                ordered_products: products,
                shipping_handled: false,
                total_price: await event.data.object.amount_total / 100,
              }
            })
            
            return newOrder
          } catch (error) {
            console.log(error)
          }
        }
      }

      const createPayload = async( event ) => {
        if(!event){
          throw new Error ('webhook Event is required for creating Payload for creating shipment')
        }
      
        if(await event.data?.object?.payment_status === 'paid'){
          try {   
              const payload =   {
                delivery_state: "pending",
                origin_address: {
                  line_1: '1802 W Tyler Ave',
                  state: 'Texas',
                  city: 'Harlingen',
                  postal_code: '78550',
                  company_name: 'USA',
                  contact_name: 'Jockey',
                  contact_phone: '202-555-0185',
                  contact_email: 'chinguunbaatar17@gmail.com',
                  country_alpha2: 'US'
                },
                destination_address: {
                  line_1: `${await event.data.object.shipping_details.address.line1}`,
                  state: `${await event.data.object.shipping_details.address.state}`,
                  city: `${await event.data.object.shipping_details.address.city}`,
                  postal_code: `${await event.data.object.shipping_details.address.postal_code}`,
                  contact_name: `${await event.data.object.customer_details.name}`,
                  contact_email: `${await event.data.object.customer_details.email}`,
                  country_alpha2: `${await event.data.object.shipping_details.address.country}`,
                  contact_phone: `${await event.data.object.customer_details.phone}`
                },
                order_data: {
                  platform_order_number: `${await event.data.object.payment_intent}`,
                },
                incoterms: 'DDU',
                insurance: {is_insured: false},
                courier_selection: {
                  allow_courier_fallback: false, 
                  apply_shipping_rules: true,
                  // selected_courier_id: '2e95a66c-3de7-4770-b3ca-cbd94e76220e'
                },
                shipping_settings: {
                  units: {weight: 'kg', dimension: 'cm'},
                  buy_label: false,
                  buy_label_synchronous: false,
                  printing_options: {format: 'png', label: '4x6', commercial_invoice: 'A4', packing_slip: '4x6'}
                },
                parcels: [
                  {
                    box: {slug: 'test', length: 10, width: 10, height: 10},
                    items: [
                      {
                        quantity: 1,
                        dimensions: {length: 1, width: 1, height: 1},
                        contains_battery_pi966: false,
                        contains_battery_pi967: false,
                        contains_liquids: false,
                        origin_country_alpha2: 'US',
                        actual_weight: 0.7,
                        declared_currency: `${await event.data.object.currency.toUpperCase()}`,
                        declared_customs_value: await event.data.object.amount_total / 100,
                        description: 'painting',
                        hs_code: '6'
                      }
                    ],
                    total_actual_weight: 0.3
                  }
                ]
              } 
              
              return payload        
              
            } catch (error) {
              console.log(error)
              return
            }
        }else if(await event.type === 'checkout.session.expired'){
          return 'this session has expired'
        }
              
      }
      
      const createShippingOrder = async(payload) => {
        try {
          if (!payload) {
            console.log('Payload is required for creating shipment')
            throw new Error('Payload is required for creating shipment');
          }
      
          const shippingInfo = await sdk.shipments_create( payload );
          // console.log(shippingInfo)
          return shippingInfo;
        } catch (error) {
          console.log(error)
          return error
        }
      }

      const updateOrderinfo = async(shippingInfo, event, newOrder) => {
        // console.log(shippingInfo)
        try {
          if(shippingInfo.data?.status === 'success'){
            await strapi.plugins['email'].services.email.send({
                      to: 'miles@4idps.com',
                      from: 'chinguunbaatar17@gmail.com', //e.g. single sender verification in SendGrid
                      subject: 'Shipping proccess of your purchase has successfully began!',
                      text: `Hello ${ await event.data.object.shipping_details.name}. Your purchase will soon shipped to ${await event.data.object.shipping_details.address.line1}, ${ await event.data.object.shipping_details.address.city} `,
                      html: `Hello ${await event.data.object.shipping_details.name}. Your purchase will soon shipped to ${ await event.data.object.shipping_details.address.line1}, ${await event.data.object.shipping_details.address.city}. 
                        Track your package here : ${shippingInfo.data.shipment.tracking_page_url}
                      `,                      
                    }, function(err, reply){
                      console.log(err, err.stack)
                      console.dir(reply)
                    })
            const order = await strapi.db.query("api::order.order").update({
              where: {id: newOrder.id},
              data:{
                shipping_handled: true,
                easyShip_ID: shippingInfo.data.shipment.easyship_shipment_id,
                shipment_tracking_link: shippingInfo.data.shipment.tracking_page_url
              }
            })
            const allNotCreated = await strapi.db.query("api::not-created-order.not-created-order").findMany({populate: {orders: true}})
            const inject = {id: order.id}
            const allNotCreatedIDs = await allNotCreated[0]?.orders?.map((order) => ({ id: order.id }));
            const newStuff =await allNotCreatedIDs.concat(inject)
            
            // if(await shippingInfo.data.shipment.delivery_state === 'not_created'){
              const categorized = (await shippingInfo.data.shipment.delivery_state === 'not_created') && await strapi.db.query("api::not-created-order.not-created-order").update({
                  where: { id: 1 },
                  data: { orders: newStuff }
              })
              console.log(categorized)
            // }
      
            console.log(order)
            return
          }
        } catch (error) {
          console.log(error)
          return error
        }
      }
      const event = await createStripeEvent(body)
      const newOrder = await createOrderUponPaymentSuccess(await event)
      const payload = await createPayload(event)
      const shippingInfo = await createShippingOrder(payload)       
      await updateOrderinfo(shippingInfo, event, newOrder)
      return shippingInfo

    } catch (error) {
      console.log(error)
      return error
    }
    
  }

};
