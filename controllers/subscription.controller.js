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


export const updateSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find the subscription first
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to update (user can only update their own subscriptions)
        if (req.user._id.toString() !== subscription.user.toString()) {
            const error = new Error("You are not authorized to update this subscription");
            error.statusCode = 403;
            throw error;
        }

        // Remove fields that shouldn't be updated directly
        delete updateData.user;
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // If startDate or frequency is being updated, remove renewalDate to let the model recalculate it
        if (updateData.startDate || updateData.frequency) {
            delete updateData.renewalDate;
        }

        // Update the subscription
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true // Run mongoose validations
            }
        );

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: updatedSubscription
        });

    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the subscription first
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to delete (user can only delete their own subscriptions)
        if (req.user._id.toString() !== subscription.user.toString()) {
            const error = new Error("You are not authorized to delete this subscription");
            error.statusCode = 403;
            throw error;
        }

        // Delete the subscription
        await Subscription.findByIdAndDelete(id);

        // Optional: Cancel any active workflows for this subscription
        // You might want to implement workflow cancellation here if your workflow system supports it

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}



export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body; // Optional cancellation reason

        // Find the subscription first
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to cancel (user can only cancel their own subscriptions)
        if (req.user._id.toString() !== subscription.user.toString()) {
            const error = new Error("You are not authorized to cancel this subscription");
            error.statusCode = 403;
            throw error;
        }

        // Check if subscription is already cancelled
        if (subscription.status === 'cancelled') {
            const error = new Error("Subscription is already cancelled");
            error.statusCode = 400;
            throw error;
        }

        // Update subscription status to cancelled
        const cancelledSubscription = await Subscription.findByIdAndUpdate(
            id,
            { 
                status: 'cancelled',
                // Optional: Add cancellation metadata
                cancelledAt: new Date(),
                cancellationReason: reason || 'User requested cancellation'
            },
            {
                new: true, // Return updated document
                runValidators: true
            }
        );

        // Optional: Cancel any active workflows for this subscription
        // You might want to implement workflow cancellation here if your workflow system supports it

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: cancelledSubscription
        });

    } catch (error) {
        next(error);
    }
}