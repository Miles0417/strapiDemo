("use strict");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create( ctx ) {

    const { products } = await ctx.request.body;

    try {

        // console.log(products)
        // const res = await strapi.service("api::order.order").create(
        //   { data: 
        //     {  
        //       products: await products, 
        //       stripeID: await products.id, 
        //     } 
        //   });
  

        // return {res}

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

      const response = await stripe.checkout.sessions.create( {
        shipping_address_collection: {allowed_countries: ['US', 'CA', 'FR', 'CH', 'BE']},
        payment_method_types: ["card"],
        mode: "payment",
        success_url: "http://localhost:8000/products",
        cancel_url: "http://localhost:8000/error",
        line_items: await lineItems,
      });            
      // console.log(response)
      const res = await strapi.service("api::order.order").create(
        { data: 
          {  
            products: await products, 
            stripeID: await response.id,  
          } 
        });
      // ctx.response.status = 200
      return {res}
    } catch (error) {
      ctx.response.status = 500;
      console.log(error)
      return { error };
    }
  },
}));