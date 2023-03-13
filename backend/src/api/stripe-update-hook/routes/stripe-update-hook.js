module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/stripe-update-hook',
     handler: 'stripe-update-hook.exampleAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
