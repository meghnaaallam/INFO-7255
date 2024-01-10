const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const validate = require('../middleware/validate')
const {getPlan, postPlan, deletePlan, getplan, updatePlan, putPlan } = require('../controllers/planController');
const planModel = require('../models/planSchema')


//get a list of plans from the database
router.get('/', jsonParser,validate, getPlan);

//get an individual plan to the database
router.get('/:id', jsonParser,validate, getplan);

//adding a new plan to the database
router.post('/', jsonParser,validate, postPlan);

//patch request
router.patch('/:id',jsonParser, validate, updatePlan)

//put request
router.put('/:id',jsonParser, validate, putPlan);

//delete a plan from the database 
router.delete('/:id', validate, deletePlan );

module.exports = router;