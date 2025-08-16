import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    // Implement Signup logic here

    const session = await mongoose.startSession();
    session.startTransaction(); // Start a session for transaction support, for atomic updates
    

    try{

        // Logic to create a new user

        // If user creation is successful, commit the transaction


        const {name , email, password} = req.body;

        // check if user already exisitng

        const existingUser = await User.findOne({email});

        if(existingUser){
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error; // Throw an error if user already exists
        }


        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name,email,password:hashedPassword}], {session});

// adding a session to it
// if something goes wrong
//if we abort
// than user will not be created

// now generate token for sign in


       

    const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});


await session.commitTransaction();
session.endSession();


res.status(201).json({
    success: true,
    message : "User created successfully",
    data: {
        token,
        user : newUsers[0]
    }
        
})


    }catch(error){
        await session.abortTransaction(); // Rollback transaction on error
        session.endSession();

        next(error); // Pass the error to the error handling middleware
    }


}

export const signIn = async (req, res, next) => { 
    // Implement Signin logic here

    try{

        const {email, password} = req.body;

        // check if user exists

        const user = await User.findOne({email});


        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error; // Throw an error if user not found
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // bcrypt will encrypt the plain password and compare it with the hashed password in the database

        if(!isPasswordValid){
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error; // Throw an error if password is invalid
        }

        // geneate jwt token
        // if user is found and password is valid
                                //payload , secret , options
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        }); 


    }catch(error){

        next(error); // Pass the error to the error handling middleware

    }


}


export const signOut = async (req, res, next) => {
    // Implement SignOut logic here
}