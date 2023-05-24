const express = require('express')
const dotenv = require( 'dotenv' )
const flash = require( 'connect-flash')
const cors = require( 'cors')
const session = require( 'express-session')
const cookieParser = require( 'cookie-parser')
const passport = require( './config/passport.js')
// const { readdirSync } = require( 'fs'
const usersRoutes = require( './routes/user.js')
const adminRoutes = require( './routes/admin.js')
dotenv.config()
const db = require( './config/db.js')
const morgan = require( 'morgan')


const app = express();

 // db
db.sync().then(() => {
  console.log('DB is connected')
}).catch((error) => {
  console.log(error)
})


// archivos staticos
app.use(express.static('public'));

// middleware

// cookieparser
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(morgan('dev'))

// mostrar datos de formularios
app.use(express.json({ limit: "2mb" }));
app.use(cors());

// passport
app.use(passport.initialize())
app.use(passport.session())

//
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  const date = new Date()
  res.locals.year = date.getFullYear()
  next()
})

// routes
app.use('/api/v1', usersRoutes )
app.use('/api/v1', adminRoutes )
// readdirSync("./routes").map((r) => app.use("/api/v1", require("./routes/" + r)));
// port
const port = process.env.DEV_PORT || 5002;
// const host = process.env.HOST || '0.0.0.0'

app.listen(port /*host*/, () => {
  console.log(`Server's running at port ${port}`)
})