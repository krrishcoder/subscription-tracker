import {Router} from 'express'
import { getUser, getUsers, updateUser } from '../controllers/user.controller.js'
import { authorize } from '../middlewares/auth.middleware.js';

const userRouter = Router()

// GET /users -> get all users
// GET /users/:id -> get user by id // 123

userRouter.get("/:id", authorize , getUser);
userRouter.get("/", getUsers );
userRouter.post("/",(req,res)=> res.send({title:'Create new user'}))
userRouter.put("/:id", authorize, updateUser)
userRouter.delete("/:id",(req,res)=> res.send({title:'delete user'}))


export default userRouter; 