const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(v) {
//             if (!validator.isEmail(v)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be a postive number')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         minlength:[7,'password is to short'],
//         trim:true,
//         validate(value){
           
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('password cannot include  "password" ')
//             }


//         }
//     }   
// })

// const me = new User({
//     name: '   rachit ',
//     email: '34saffdf@gmail.com   ',
//     password:'Password232'
// })





// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required:true,
//         trim:true
//     },
//     completed: {
//         type: Boolean,
//         default:false
//     }
// })

// const task = new Task({
//     description: '           Learn the Mongoose library',
   
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })