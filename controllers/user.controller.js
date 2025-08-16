import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Subscription from "../models/subscription.model.js";


export const getUsers = async (req, res, next) => {

    try{
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users
        });

    }catch(error){
        next(error);
    }

}

export const getUser = async (req, res, next) => {

    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
    
        res.status(200).json({
            success: true,
            data: user
        });

    }catch(error){
        next(error);
    }

}


export const updateUser = async (req, res, next) => {

    try {
        const { id } = req.params;
        const { name, email, password, currentPassword } = req.body;

        // Find the user first
        const user = await User.findById(id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to update (user can only update their own profile)
        if (req.user && req.user._id.toString() !== id) {
            const error = new Error("You are not authorized to update this user");
            error.statusCode = 403;
            throw error;
        }

        // Prepare update object
        const updateData = {};

        // Update name if provided
        if (name && name.trim()) {
            updateData.name = name.trim();
        }

        // Update email if provided and different from current
        if (email && email.trim() && email.toLowerCase() !== user.email) {
            // Check if email already exists
            const existingUser = await User.findOne({ 
                email: email.toLowerCase(), 
                _id: { $ne: id } 
            });
            
            if (existingUser) {
                const error = new Error("Email already exists");
                error.statusCode = 409;
                throw error;
            }
            
            updateData.email = email.toLowerCase().trim();
        }

        // Update password if provided
        if (password) {
            // If updating password, require current password for security
            if (currentPassword) {
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    const error = new Error("Current password is incorrect");
                    error.statusCode = 401;
                    throw error;
                }
            } else {
                const error = new Error("Current password is required to change password");
                error.statusCode = 400;
                throw error;
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // If no valid updates provided
        if (Object.keys(updateData).length === 0) {
            const error = new Error("No valid updates provided");
            error.statusCode = 400;
            throw error;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { 
                new: true, // Return updated document
                runValidators: true // Run mongoose validations
            }
        ).select("-password"); // Exclude password from response

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        // Find the user first
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to delete (user can only delete their own account)
        if (req.user && req.user._id.toString() !== id) {
            const error = new Error("You are not authorized to delete this account");
            error.statusCode = 403;
            throw error;
        }

        // Require password confirmation for security
        if (!password) {
            const error = new Error("Password is required to delete account");
            error.statusCode = 400;
            throw error;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Incorrect password");
            error.statusCode = 401;
            throw error;
        }
        
        await Subscription.deleteMany({ user: id });
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully. We're sorry to see you go!"
        });

    } catch (error) {
        next(error);
    }
}