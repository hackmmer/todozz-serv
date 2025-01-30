export const environment = {
  production: false,

  database: {
    url: '',
    options: {
      dbName: '',
      directConnection: false,
    },
  },

  cors: {
    origin: '',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
};
