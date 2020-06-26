const express = require('express')
require('./db/mongoose')
// const User = require('./models/user')
// const Task = require('./models/task')

const userRouter=require('./routes/user')
const taskRouter=require('./routes/task')

const app = express()
const port = process.env.PORT 

// app.use((req,res,next)=>{
//     res.status(503).send('on maintence see u soon')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const jwt= require('jsonwebtoken')
const { ObjectID } = require('mongodb')

// const myfunction= async()=>{
//     const token=jwt.sign({_id:'1sdhsjs23'},'dbvalid');
//     console.log(token)
//     const data=jwt.verify(token,'dbvalid')
//     console.log(data)
 
// }

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     //  const task = await Task.findOne({_id:"5ef242c9f9041f355c3f7a5a"})

//     //  await task.populate('Owner').execPopulate()
//     //  console.log(task)
// //plzz keeep in ming tha tthe the task u are accepting has its user logined
    
//     // const user=await User.findById('5ef253cad64d4d2dfcf1a24e')
//     //  await user.populate('all_tasks').execPopulate()
//     //  console.log(user.all_tasks)
//  }
//  main()