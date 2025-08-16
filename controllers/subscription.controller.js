import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {


    try{

        const subscription = await Subscription.create({
            ...req.body,
            user : req.user._id,

        });

       const{workflowRunId}= await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId: subscription._id
            },
            headers: {
                'Content-Type': 'application/json',
            },

            retries:0,

        });

           // url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
    

        res.status(201).json({success : true, data : {subscription , workflowRunId}});

    }catch(error){
        next(error);
    }

}


export const getUserSubscriptions = async (req, res, next) => {

    try{


        // Check if the user is same as the one in the token
        if(req.user._id != req.params.id) {
            const error = new Error("You are not authorized to view this user's subscriptions");
            error.statusCode = 401;
            throw error; // Throw an error if user is not authorized
        }

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success : true, data : subscriptions});

    }catch(error){
        next(error);
    }

}