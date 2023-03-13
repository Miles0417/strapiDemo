module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  // {
  //   name: 'strapi::cors',
  //   config: {
  //     enabled: true,
  //     header: '*',
  //     // origin: ['https://https://f2c0-59-127-82-34.jp.ngrok.io']
  //   }
  // },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  { name: 'strapi::body', config: { includeUnparsed: true } },
  // 'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
