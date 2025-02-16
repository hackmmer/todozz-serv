export const environment = {
  production: false,

  database: {
    url: 'mongodb://192.168.1.102:27017',
    options: {
      dbName: 'todos',
      directConnection: true,
    },
  },

  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
};
