const express=require('express')
const User=require('../models/user')
const router=new express.Router()
const auth =require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelEmail}=require('../emails/account')


router.post('/users', async (req, res) => {
   
    const user = new User(req.body)
    sendWelcomeEmail(user.email,user.name)
  
    try {
        const token = await user.generateAuthToken()

        await user.save()
        
        res.status(201).send({user,token})
    } catch (e) {

        res.status(400).send(e)
    }
})
//A ITS NOT ./USERS
// router.post('/users/login',async (req,res)=>{
//     try{
//         //find by credentials in model
//         const user=await User.findByCredentials(req.body.email,req.body.password)
        
//         //the below  function is to be operated upon the instance 
//         const token=await user.genrateAuthToken()
//         res.send({user,token})
//     }catch(e){
//         res.status(400).send()
//     }
// })

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e) {
        res.status(400).send()
    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.forEach((token)=>{
            return token!==req.token
        })
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.send(400).send()
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})




router.get('/users/me',auth,async (req, res) => {
    //as in auth req.user gets the data no need to dearch again
    //wastes resourse
        res.send(req.user)
    
})


router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //this bypasses middleware bypasses so do it code way
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
        //now w e have user in auth
        //const user=await User.findById(req.params.id)


        //iterate over updates array and update
        //upates was owr Object.keys(req.body)

        updates.forEach((update)=>{
            //as the update value in for each changed
            //so the key value changes
            //so we dynamically access using squre bracket
            //instead of object.(if we know whick key)
            req.user[update]=req.body[update]
        })
        await req.user.save()
        if (!req.user) {
            return res.status(404).send()
        }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        //console.log(req.user)
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.send({user:req.user})
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})




/////file uploads



const upload=multer({
    //dest:'./src/avatar',
    //  if w do not provide the dest we can access it on req.file.buffer
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        //reges for matching the file
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
         return   cb(new Error('plzz provide a image file'))
        }
        cb(undefined,true); 
    }
})
//upload.single('the query') provides  us a middleware whichtakes the from the same name as query
//and puts it to thedestination
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer =await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=ibuffer;
    await req.user.save()

    res.send();
},(error,req,res,next)=>{
    console.log(error)
    res.status(400).send({error:error.message})
    //neccasary to change the html recived to a json
    })

    router.get('/users/:id/avatar',async(req,res)=>{
        try{
            //not _id but id
            const user=await User.findById(req.params.id);
            if(!user || !user.avatar){
                throw new Error('404 not found')
            }
            //setting the content type always by default json thats whywe receive the dataa as jsonin postman
            res.set('Content-Type','image/png')
            res.send(user.avatar)
        }catch(e){
            res.status(404).send(e)
            console.log(e);
        }

    })

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined;
    await req.user.save()
    res.send();
},(error,req,res,next)=>{
    console.log(error)
    res.status(400).send({error:error.message})
    //neccasary to change the html recived to a json
    })
module.exports=router