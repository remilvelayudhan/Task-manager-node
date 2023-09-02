
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();


const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();
require('./db');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/users',userRoutes);
app.use('/tasks', taskRoutes);

app.get('/',(req,res)=>{
    res.json({
        message: 'Task Mangager API is working' 
    })
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

