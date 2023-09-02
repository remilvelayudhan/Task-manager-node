const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middlewares/auth');

// router.get('/',(req,res)=>{
//     res.json({
//         message: 'Task routes is working' 
//     })
// })


//create a task
router.post('/', auth, async (req, res) => {
try{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
   await task.save();
   res.status(201).send({
       task, message: 'Task created successfully'
   })
}catch(err){
    res.status(400).send({
        message: err.message
    })
}
});

// get all taks

router.get('/', auth, async (req, res) => {

   
    try{
        const tasks = await Task.find({owner: req.user._id});
        res.status(200).send({tasks, count: tasks.length, message: "Tasks Fetched Successfully"});
    }catch(err){
        res.status(500).send({
            message: err.message
        })
    }
})

// fetch task by id
router.get('/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send({
                message: 'Task not found'
            })
        }
        res.status(200).send(task);
    }catch(err){
        res.status(500).send({
            message: err.message
        })
    }
})


// delete task by id
router.delete('/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send({
                message: 'Task not found'
            })
        }
        res.status(200).send(task);
    }catch(err){
        res.status(500).send({
            message: err.message
        })
    }
})

// update a task by id   -   description , completed
router.patch('/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const taskid = req.params.id;
    const isvaildOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isvaildOperation){
        return res.status(400).json({error: "Invalid Updates"});
    }
    try{
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
      if(!task){
          return res.status(404).send({
              message: 'Task not found'
          })
      }
      updates.forEach((update) => task[update] = req.body[update]);
      await task.save();
      res.status(200).send({task, message: "Task updated successfully"});
    }catch(err){
        res.status(500).send({
            message: err.message
        })
    }


})


module.exports = router;