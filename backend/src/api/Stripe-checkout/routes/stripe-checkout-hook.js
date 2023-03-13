module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/stripe-checkout-hook',
     handler: 'stripe-checkout-hook.webhook',
     config: {
      policies: [],
      middlewares: [],
     },
    },
  ],
};
