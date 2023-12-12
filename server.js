const { app } = require('./app');
const { config } = require('./config');

// app.listen(config.PORT);
app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
