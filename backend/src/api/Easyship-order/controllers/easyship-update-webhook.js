'use strict';

// secret_key = 'webh_092dflkjhwelkjr109834wlkejhr8sdh'

/**
 * A set of functions called "actions" for `Easyship-update-webhook`
 */
// signature = request.env['X-EASYSHIP-SIGNATURE']
'use strict';

const endpointSecret = "webh_1eba95b29c570daf789fa3119dc8544d";
const easyship = require('stripe')(process.env.EASYSHIP_KEY);
// secret_key = 'webh_092dflkjhwelkjr109834wlkejhr8sdh'

/**
 * A set of functions called "actions" for `Easyship-update-webhook`
 */
const jwt = require("jsonwebtoken");

const secret_key = "webh_1eba95b29c570daf789fa3119dc8544d";
module.exports = {
  listenToUpdates: async (req, ctx) => {

    try {
      const signature = await req.get("X-EASYSHIP-SIGNATURE");
      if (!signature) {
        return console.log('no sig')
      }
    
        const res = jwt.verify(signature, secret_key, { algorithms: ["HS256"] }, 
        // function(err, decoded, event) {          
        //   console.log(err, 'err')
        //   console.log(decoded, 'decoded')                          
        //   console.log(event)
        // }
        )
        console.log(res)
        return ctx.body = 200;

      
    } catch (err) {
      // ctx.body = err;
      console.log(err)
    }
  }
};

