module.exports = ({ env }) => ({
    // ...
    email: {
      config: {
        provider: 'sendmail',
        settings: {
          sendmail: true,
          defaultFrom: 'chinguunbaatar17@gmail.com',
          defaultReplyTo: 'chinguunbaatar17@gmail.com',
        },
      },
    },
    // ...
});