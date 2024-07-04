const app = require("./api/app"); // la aplicación Express real
const config = require("./api/utils/config");
const logger = require("./api/utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
