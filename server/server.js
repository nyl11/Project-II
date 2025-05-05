require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const postRoutes= require('./routes/posts')
const userRoutes= require('./routes/user')

//creates expree app
const app = express()

//middlewear
app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()

})

//route
app.use('/api/posts',postRoutes)
app.use('/api/user',userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,  ()=>{
        console.log('connected to database `listening on port 5000!!')
    })
})
.catch((error)=>{
    console.log(error)
}
)




