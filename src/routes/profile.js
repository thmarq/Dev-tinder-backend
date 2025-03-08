const express = require('express');
const {adminAuth} = require('../utils/middlewares/auth.js');
const { validateEditProfile, validateChangePassword } = require('../utils/validator.js');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", adminAuth , async (req, res)=> {
    try {
        const user = req.user // from middleware user obj is appended in request obj
        return res.status(200).send({data : user})
    }
    catch(e){
        res.status(404).send(`Something went wrong ${e}`)
    }
})

profileRouter.patch("/profile/edit", adminAuth , async (req, res)=> {
    try {
        validateEditProfile(req)
        console.log("Logged in user ===> ", req.user)
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key])
        let updatedUser = await loggedInUser.save();
        return res.json({
            status:"Update sucess",
            user : updatedUser
        })
    }
    catch(e){
        res.status(404).send(`Something went wrong ${e}`)
    }
})

profileRouter.patch("/profile/change-password", adminAuth , async (req, res)=> {
    try {
        validateChangePassword(req)
        const {password , newPassword} = req.body;
        const loggedInUser = req.user
        const oldPassword = loggedInUser.password;
        if(!await bcrypt.compare(password, oldPassword)){
            throw new Error('Old password not match')
        }
        //TODO : check previous and new password is same or not

        loggedInUser.password = await bcrypt.hash(newPassword,10)
        await loggedInUser.save();
        return res.send({
            status:"Password changed sucess",
        })
    }
    catch(e){
        res.status(404).send(e)
    }
})

module.exports = profileRouter;