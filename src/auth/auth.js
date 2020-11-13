const jwt = require('jsonwebtoken');
const Admin = require('../models/admins');

const auth = async function(req, res, next) {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'theidowuconsiulttoken');
        const admin = await Admin.findOne({_id:decoded._id, 'tokens.token': token})
    
        if(!admin) {
            throw new Error()
        }
    
        req.token = token;
        req.admin = admin

        next()
    }catch(e) {
        res.status(401).send({
            error:'please authtenticate'
        })
    }


}

module.exports = auth