module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/Easyship-order',
     handler: 'easyship-update-webhook.listenToUpdates',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
