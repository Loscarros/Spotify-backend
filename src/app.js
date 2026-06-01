const express=require('express')

const cookieParser=require('cookie-parser')
const cors=require('cors')
const morgan=require('morgan')

const authRoutes=require('./routes/auth.routes')
const postRoutes=require('./routes/song.routes')

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan('dev'))

app.use("/api/auth",authRoutes)
app.use("/api/song",postRoutes)

module.exports=app;