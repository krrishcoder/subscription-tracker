import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async(req,res,next)=>{

    try{

        console.log("Cookies:", req.cookies);
console.log("Auth Header:", req.header("Authorization"));

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            // if token is present in the header
            token = req.headers.authorization.split(' ')[1]; // get the token from the header
        }   


        if(!token)
            return res.status(401).json({success: false, message: "Unauthorized access"});

        const decoded = jwt.verify(token, JWT_SECRET); // verify the token using the secret key

        const user = await User.findById(decoded.userId);

        if(!user)
            return res.status(404).json({success: false, message: "Unathorized access"});

        req.user = user; // attach user to the request object

        next(); // call the next middleware or route handler


        // try to access user token from header
    }catch(error){
        // if error occurs, pass it to the error handling middleware
        next(error);
    }
}


export { authorize };