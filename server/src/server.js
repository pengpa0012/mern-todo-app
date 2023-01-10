const express = require("express")
const bodyParser = require("body-parser")
const usersRoutes = require("./routes/users")
const cors = require("cors")
const connectDB = require("./config/db")

connectDB()
const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use("/users", usersRoutes)

const port = 3001

app.listen(port, () => {
  console.log("listening in port", port)
})