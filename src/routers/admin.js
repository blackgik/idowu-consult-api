const express = require('express');
const Admin = require('../models/admins');
const router =  new express.Router();
const auth = require('../auth/auth')

router.post('/admin', async (req, res) => {
    const newAdmin = new Admin(req.body);
    try{
        await newAdmin.save()
        const token = await newAdmin.generateAuthToken()
        res.status(201).send({newAdmin, token})
    }catch(e) {
        res.status(400).send({
            error: e
        })
    }
});

router.post('/admin/login', async (req, res)=> {
    try{
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.status(200).send({admin, token})
    }catch(e) {
        res.status(400).send(e)
    }
});

router.post('/admin/logout', auth, async (req, res)=> {
    try{
        req.admin.tokens = req.admin.tokens.filter(token => {
            return token.token != req.token
        })

        await req.admin.save()
        req.send()
    }catch(e) {
        res.status(401).send(e)
    }
})

router.get('/admin/me', auth, async (req, res) => {
    res.send(req.admin)
})

router.patch('/admin/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const acceptableUpdates = ['name', 'email', 'password'];
    const isValid = updates.every(update => acceptableUpdates.includes(update));

    if (!isValid) {
        res.send(409).send('database conflict with key')
    }

    try{
        updates.forEach(update=> admin[update] = req.body[update]);

        await req.admin.save()

        if(!admin) {
            res.status(404).send('admin not found');
        }
        res.send(req.admin)
    }catch (e) {
        res.status(500).send(e)
    }
});

router.delete('/admin/me', auth, async (req, res) => {
    
    try{
        
        await req.admin.remove()
        res.send(req.admin)
    }catch(e) {
        res.status(50).send(e)
    }
})

module.exports = router