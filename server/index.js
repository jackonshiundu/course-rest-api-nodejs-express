const express=require('express');
const Joi=require('joi')
const app=express();

const port=process.env.PORT||3000
//express middleware to use in the request processing pipeline
app.use(express.json())
//
const courses=[
    {id:1,name:'course 1'},
    {id:2,name:'course 2'},
    {id:3,name:'course 3'}
]
app.get('/',(req,res)=>{
    res.send('hello people')
})
app.get('/api/courses',(req,res)=>{
    res.send(courses)
})

app.get('/api/courses/:id',(req,res)=>{
    const course= courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
        res.status(404).send(`The course with id:${req.params.id} was not found`)
    }
    res.send(course)
})
app.post('/api/courses',(req,res)=>{

    const {error}=validateCourse(req.body);

    if(error){
        res.status(404).send(error.details[0].message);
        return;
    }
    const course={
        id:courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
})
app.put('/api/courses:id',(req,res)=>{
    //look up the course
    //if not existing ,return 404
    const course= courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
        res.status(404).send(`The course with id:${req.params.id} was not found`)
        return;
    }
    //validate
    //if invalid,return 400 -Bad request
    const {error}=validateCourse(req.body)
    if(error){
        res.status(404).send(error.details[0].message);
        return;
    }
    //update course 
    course.name=req.body.name;
    //return the updated course
    res.send(course)
})

function validateCourse(course){
    const schema={
        name:Joi.string().min(3).require()
    };
     return Joi.validate(course,schema);
}

app.delete('/api/courses/:id',(req,res)=>{
    const course= courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
        res.status(404).send(`The course with id:${req.params.id} was not found`)
        return;
        
    }
    //Delete a course
   const index= courses.indexOf(course);
   courses.splice(index,1)

   res.send(course)
})









//
app.listen(port,()=>{
    console.log(`listening on port:${port}`)
}) 