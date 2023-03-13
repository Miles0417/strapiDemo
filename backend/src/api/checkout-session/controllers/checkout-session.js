'use strict';
const stripe = require("stripe")(process.env.STRIPE_KEY);

// const { createCoreController } = require("@strapi/strapi").factories;

module.exports = {
  create: async(ctx) => {
    try {      
      const { products } = await ctx.request.body;
  
      const createLineItems = async(products) => {
        try {
          if(!products){
            throw new Error('Products || req.body is required for creating lineItems for creating Stripe_Checkout_Session')
          }
          const lineItems = await Promise.all(
            products.map(async (product) => {
              const item = await strapi
                .service("api::product.product")
                .findOne(product.id);
    
              return {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: item.title,
                  },
                  unit_amount: Math.round(item.price * 100),
                },
                quantity: product.quantity,
              };
            })
          );
          
          return lineItems
        } catch (error) {
          console.log(error)
        }
      }
      
      const createStripeSession = async(lineItems) => {
  
        try {
          if(!lineItems){
            throw new Error('lineItems is required to create Stripe_Checkout_Session')
          }
          
          const response = await stripe.checkout.sessions.create( {
            shipping_address_collection: {allowed_countries: ['US', 'CA', 'FR', 'CH', 'BE', 'TW']},
            payment_method_types: ["card"],
            mode: "payment",
            success_url: "http://localhost:8000/products",
            cancel_url: "http://localhost:8000/error",
            line_items: lineItems,
            phone_number_collection: {
              enabled: true,
            },
            
            metadata: {
              products: JSON.stringify(lineItems)
            }
          }); 
          return response
        } catch (error) {
          console.log(error)
        }
      }

      const lineItems = await createLineItems(products)
      return await createStripeSession(lineItems)

    } catch (error) {
      console.log(error)
    }


    
    // try {
    //   const lineItems = await Promise.all(
    //     products.map(async (product) => {
    //       const item = await strapi
    //         .service("api::product.product")
    //         .findOne(product.id);

    //       return {
    //         price_data: {
    //           currency: "usd",
    //           product_data: {
    //             name: item.title,
    //           },
    //           unit_amount: Math.round(item.price * 100),
    //         },
    //         quantity: product.quantity,
    //       };
    //     })
    //   );

    //   const response = await stripe.checkout.sessions.create( {
    //     shipping_address_collection: {allowed_countries: ['US', 'CA', 'FR', 'CH', 'BE']},
    //     payment_method_types: ["card"],
    //     mode: "payment",
    //     success_url: "http://localhost:8000/products",
    //     cancel_url: "http://localhost:8000/error",
    //     line_items: lineItems,
    //     phone_number_collection: {
    //       enabled: true,
    //     },
    //   }); 
    //   console.log(response)
    //   return {response}
    // } catch (error) {
    //   ctx.response.status = 500;
    //   console.log(error)
    //   return { error };
    // }
  }
}

// {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
// };
