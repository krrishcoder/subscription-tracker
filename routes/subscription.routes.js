import {Router} from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subsRouter = Router();

subsRouter.post("/", authorize, createSubscription );
subsRouter.get("/", (req,res)=> res.send({title : "GET all subscriptions"}));
subsRouter.get("/:id", (req,res)=> res.send({title : "GET subscriptions details "}));
subsRouter.put("/:id", (req,res)=> res.send({title : "Update subscriptions"}));
subsRouter.delete("/:id", (req,res)=> res.send({title : "delete subscription"}));
subsRouter.get("/user/:id", authorize , getUserSubscriptions );
subsRouter.put("/:id/cancel", (req,res)=> res.send({title : "cancel subscription"}));
subsRouter.get("/upcoming-renewals", (req,res)=> res.send({title : "Get upcoming subscription"}));



export default subsRouter;