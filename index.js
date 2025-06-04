const app = require("./app")
const config = require("./utils/config")
const logger = require("./utils/logger")

const cors = require('cors')
app.use(cors())

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})
