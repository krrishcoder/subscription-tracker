import {Router} from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, updateSubscription , deleteSubscription, cancelSubscription} from '../controllers/subscription.controller.js';

const subsRouter = Router();

subsRouter.post("/", authorize, createSubscription );
subsRouter.get("/", (req,res)=> res.send({title : "GET all subscriptions"}));
subsRouter.get("/:id", (req,res)=> res.send({title : "GET subscriptions details "}));
subsRouter.get("/user/:id", authorize , getUserSubscriptions );
subsRouter.put("/:id", authorize, updateSubscription);
subsRouter.delete("/:id", authorize, deleteSubscription);
subsRouter.put("/:id/cancel", authorize, cancelSubscription);
subsRouter.get("/upcoming-renewals", (req,res)=> res.send({title : "Get upcoming subscription"}));



export default subsRouter;