const express = require('express');
const app = express();
app.use(express.json());
const  Plan = require('../models/planSchema'); // Import your Mongoose models
const etag = require('etag');

const queue = require('../rabbitMQ/rabbitMQ')

// Create a new plan
const postPlan = async function(req, res, next)  {
  const existingPost = await Plan.findOne({ objectId: req.body.objectId });
  console.log("exsisting post",existingPost)

    if (existingPost) {
      // Object ID already exists, don't create a new post
      return res.status(400).json({ error: 'Object ID already exists.' });
    }
    const newPlan = new Plan(req.body)
   newPlan.save(newPlan)
      .then(plan =>{
        //console.log(plan)
        const message = {
          type: "PUT",
          document: plan
      }
       queue.postToQueue(message);
     return res.status(201).json(plan);
  })
  .catch(err => {
    console.log(err)
    return res.status(404).json({ error: err.message })
  })
}


function generateETag(data) {
  // Implement your custom ETag generation logic here, e.g., a hash of the data
  return require('crypto').createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// get a plan
function getplan(req, res, next) {
      res.header('Cache-Control', 'no-cache'); 
  Plan.find({objectId: req.params.id})
    .then(plan => {
      const etag = generateETag(plan);

    // Set the ETag in the response header
    res.set('ETag', etag);
    // Check the If-None-Match header from the client
    const clientETag = req.get('If-None-Match');

    // Compare ETags
    if (clientETag  === etag) {
      // ETags match, send a 304 Not Modified response
      return res.status(304).end();
    }
    res.status(200).json(plan);
    })
    .catch(err => {
      return res.status(404).json({ error: err.message })
    });
}


//retrieve all plans
function getPlan(req, res, next) {
  Plan.find()
      .then(plan => {
      return res.status(200).json(plan);
 })
 .catch(err => {
 return res.status(404).json({ error: err.message })
});
}


//put request
const putPlan = function(req, res, next) {
  res.header('Cache-Control', 'no-cache'); 
  Plan.find({objectId: req.params.id})
      .then(plan => {
        const etag = generateETag(plan);

      // Check the If-None-Match header from the client
    const ifNoneMatch = req.get('If-Match');

    // Compare ETags
    if (ifNoneMatch  === etag) {
     // console.log(req.body);
      Plan.findOneAndUpdate({objectId: req.params.id}, req.body, { returnOriginal: false })
          .then(plan => {
      res.set('ETag', etag);
    // queue.sendData(plan);
    const message = {
      type: "PUT",
      document: plan
  }
   queue.postToQueue(message);
      return res.status(200).json(plan);
    })
  }
    else {
      // ETags match, send a 412 Not Modified response
      return  res.status(412).send("Reseource has been modified or you have provided the wrong ETag");
    }
      })
  .catch(err => {
      console.error(err.message);
     return res.send(400).send('Server Error');
  });
}


//patch request
const updatePlan = function(req, res, next) {
  const updates = req.body;
  res.header('Cache-Control', 'no-cache'); 
  Plan.find({objectId: req.params.id})
      .then(plan => {
        const etag = generateETag(plan);

    // Check the If-None-Match header from the client
    const ifMatch = req.get('If-Match');

    // Compare ETags
    if (ifMatch  === etag) {
      Plan.findOneAndUpdate({objectId: req.params.id}, req.body, { returnOriginal: false })
      .then(plan => {
  res.set('ETag', etag);
  //queue.sendData(plan);
  const message = {
    type: "PUT",
    document: plan
}
 queue.postToQueue(message);
  return res.status(200).json(plan);
      })
    }
    else {
      return  res.status(412).send("Reseource has been modified or you have provided the wrong ETag");
    }
      })
  .catch(err => {
    console.log(err)
     return res.status(400).json(err);
  });
}

//delete a plan
const deletePlan = function(req,res, next)
{
  res.header('Cache-Control', 'no-cache'); 
  Plan.find({objectId: req.params.id})
      .then(plan => {
        const etag = generateETag(plan);

    // Check the If-None-Match header from the client
    const ifNoneMatch = req.get('If-Match');

    // Compare ETags
    if (ifNoneMatch  === etag) {
      
    Plan.findOneAndRemove({objectId : req.params.id})
    .then(function(plan)
        {

         console.log('plan deleted',req.params.id);
            res.set('ETag', etag);
            const message = {
              type: "DELETE",
              document: plan
          }
           queue.postToQueue(message);
  return res.status(204).json(plan);
        })
      }
    })
    .catch(err => {
     return res.status(404).json({ error: err.message })
    });
}

module.exports = {getPlan, postPlan, deletePlan, getplan,updatePlan, putPlan};


