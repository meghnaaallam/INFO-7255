const planModel = require('../models/planSchema');

//verify token 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!req.headers.authorization || req.headers.authorization==='null' || req.headers.authorization.indexOf('Bearer ') ===-1){
        return res.status(401).send("Missing Authorization Header");
    } 
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  //console.log(payload);
}

verify()
.then(()=> next())
.catch((err) => {
    console.log(err)
})
};

module.exports = verifyToken;