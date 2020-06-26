const express = require('express')
const Task = require('../models/task')
const { update } = require('../models/task')
const auth =require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth, async (req, res) => {
   // const task = new Task(req.body)
    const task=new Task({
        ...req.body,
        Owner:req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
        console.log(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//Get/tasks?completed=true
//Get/tasks?limit=2&skip=2
//tasks?sortBy=createdAt:desc
router.get('/tasks',auth, async (req, res) => {
    try {
        // await req.user.populate('all_tasks').execPopulate()
      //  console.log(req.user.all_tasks)
      const match={}
      const sort={}
      if(req.query.sortBy){
        const parts=req.query.sortBy.split(':');
        // // can not usee .parts as dynnamic value changes so have to access using []
            // sort.parts[0]=
        sorts[parts[0]]=parts[1]==='desc'?-1:1
      }
      if(req.query.completed){
          match.completed= req.query.completed==='true'
          //if in req a true is written it is a string
          //converted to boolean
      }
      await req.user.populate(
          {
              path:'all_tasks',
              match,
              options:{
                  limit:parseInt(req.body.limit),
                  skip:parseInt(req.query.skip),
                            //       sort:{
                            //           //createdAt:1
                            //    //descending oreder       completed:-1
                            //       }
                    sort
              }
              

        }).execPopulate()
        res.send({tasks:req.user.all_tasks,user:req.user})
        } catch (e) {
            res.status(500).send()
        }   
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task=await Task.findOne({_id,Owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
//task should be authnticated
router.patch('/tasks/:id',auth , async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //try to look under user to see whuy commented

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
     // const task=await Task.findById(req.params.id)
     const task=await Task.findOne({_id:req.params.id,Owner:req.user._id})

     if (!task) {
        return res.status(404).send()
    }
        updates.forEach(update => {
            
            task[update]=req.body[update]
        });
        await task.save() 
       

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,Owner:req.user._id})

        if (!task) {
            res.status(404).send()
        }


        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router