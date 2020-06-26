const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')



const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        //create unique email for alll users
        //have to wipe whole of db to use it
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[7,'password is to short'],
        trim:true,
        validate(value){
           
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot include  "password" ');
            }


        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
    
},{timestamps:true})

;
//the link to task
userSchema.virtual('all_tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'Owner'
})






//this function works on the instances of the schema
userSchema.methods.generateAuthToken=async function(){
    const user=this;
    //moongoose converted our obect id to string but here we have to 
    //convert the binary object id manualy
    //payload and secret
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);

    user.tokens= user.tokens.concat({token});
    await user.save();
    //console.log(token)
    return token;
}
//runds everytyme userSchema or any user is stringified
userSchema.methods.toJSON= function(){
    const user = this;
    const userObject=user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar
 
    return userObject;
}
// Schema Statics are methods that can be invoked directly by a Model
// (unlike Schema Methods,
// which need to be invoked by an instance of a Mongoose document).
// You assign a Static 
// to a schema by adding the function to the schema's statics object.
userSchema.statics.findByCredentials=async (email,password)=>{
    const user =await User.findOne({email});
    if(!user){
        throw new Error('unable to login');
    }
    //console.log(password,user.password)  
    const isMatch= await bcrypt.compare(password,user.password);
     
    
    if(!isMatch){
        throw new Error('unable to login');
    }
    return user;
}






//need normal function to use this binding
//pre middleware performed before saved 
userSchema.pre('save',async function(next ){
    const user=this;
    //if we never call nexxt it will keep running 
    //thinking we are still running some code before saving user
   
    if(user.isModified('password')){
       // console.log('bro') 
        user.password=await bcrypt.hash(user.password,8);
        //.HASH IS A async function so callback promise and await
        //can be used and async is used here to et the value back
    }
    next();
})


const Task=require('./task')




userSchema.pre('remove',async function (req,res,next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next();
})




const User = mongoose.model('User',userSchema);
module.exports=User;
//funfact all the new functions 
// we created are accesibble directly on the instances 
// of user so no exporting is requiresd as the
//  are when created automatically used on  the Schema or
// instance
//simply they become part of User