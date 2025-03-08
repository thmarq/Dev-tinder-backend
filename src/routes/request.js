const express = require('express');
const requestRouter = express.Router();
const {adminAuth} = require('../utils/middlewares/auth.js');
const  connectionRequestModel = require('../models/connectionRequest.schema.js');
const userModel = require('../models/user.schema.js');

requestRouter.post("/request/send/:status/:userId", adminAuth , async (req, res)=> {
    try {
        const fromUserId = req.user._id; // from middleware user obj is appended in request obj
        const toUserId = req.params.userId;
        const status = String(req.params.status);

        // if(fromUserId === toUserId){
        //     return res.status(400).json({message:'cannot send request to yourself'})
        // }
        // we cannot accept the req in this api
        if(status === 'accepted'){
            return res.status(400).json({message:'Invalid status type'})
        }

        const user = await userModel.findById(toUserId)
        if(!user){
            return  res.status(400).json({message:'User not found'})
        }
        const exisitingRequests = await connectionRequestModel.findOne({
            $or:[
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if(exisitingRequests){
            return res.status(400).json({message:'Request already existing !'})
        }
        const data = await connectionRequestModel.create({
            fromUserId,
            toUserId,
            status
        })

        res.status(200).json({
            message:`${req.user.firstName} is ${status} to ${user.firstName}`, 
            data
        })
    }
    catch(e){
        res.status(404).send(`Something went wrong ${e}`)
    }
})

//reciever
requestRouter.post("/request/review/:status/:requestId",adminAuth, async (req , resp)=> {
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        console.log("Params ===========+> ", req.params)
        const allowedStatus = ['accepted' , 'rejected']
        if(!allowedStatus.includes(status)){
            return resp.status(400).json({ message : ' status not allowed'})
        }
        const connectionRequest = await connectionRequestModel.findOne({
            _id: requestId,
            status : "interested",
            toUserId : loggedInUser._id
        })
        if(!connectionRequest){
            return resp.status(400).json({ message : 'Connection request not found'});
        }
        connectionRequest.status = status; // here it automatically can update because findone returns a mongoose instance
        connectionRequest.save();

        return resp.status(200).json({
            message:"Connection request " + status,
            data : connectionRequest
        })
    }catch(e){
        resp.status(400).send(`Error ${e.message}`)
    }

})
module.exports = requestRouter;