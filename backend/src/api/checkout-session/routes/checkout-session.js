module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/checkout-session',
     handler: 'checkout-session.create',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
