require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const winston = require("winston")
const port = 3000

const corsOptions = {
  origin: "https://example.com",
  optionsSuccessStatus: 200,
}

const expressApp = express()
expressApp.use(helmet())
expressApp.use(cors(corsOptions))
expressApp.use(express.static("public"))
expressApp.use(express.static(path.join(__dirname, "views")))

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  )
}

expressApp.use((req, res, next) => {
  logger.info("HTTP Request", { method: req.method, url: req.url })
  next()
})

expressApp.use((err, req, res, next) => {
  logger.error("Something went wrong", { error: err.stack })
  if (!res.headersSent) {
    res.status(500).send("Something broke!")
  }
})

expressApp.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
