import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import dotenv from 'dotenv';

dotenv.config();

export const signin = async(req, res) => {
    
    const {email, password} = req.body;

    try {
        
        // Step 1, look for the user in existing User Data Base.
        const ExsistingUser = await User.findOne({ email });

        // If the user does not exist then return status 404
        if(!ExsistingUser)
            return res.status(404).json({message: "Ops, the user does Not Exits!"});
        
        // Step 2, if user exists then check if the password entered is matching the database password.
        const isCorrectPassword = await bcrypt.compare(password, ExsistingUser.password);

        // If not matching password return a status of 400 saying invalid password.
        if(!isCorrectPassword)
            return res.status(400).json({ message: 'Invalid Password!'});
        
        // Step 3, if all of the above is correct then generate a JSON web token for the user.
        const token = jwt.sign({ email: ExsistingUser.email, id: ExsistingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Step 4, everything done fine then return the user with the token.
        res.status(200).json({result: ExsistingUser, token: token});

    } catch (error) {
        res.status(500).json({ message: 'Something went Wrong!' });
    }
};

export const signup = async(req, res) => {

    const { email, password, name } = req.body;

    try {
        // Step 1, look for the user in existing User Data Base.
        const ExsistingUser = await User.findOne({ email });

        // If the user exists then return status 400
        if(ExsistingUser)
            return res.status(400).json({message: "Ops, the user already Exits!"});

        // Step 2, Hash the password for encryption
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();
        // Step 3, if all of the above is correct then generate a JSON web token for the user.
        const token = jwt.sign({ email: email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Step 4, everything done fine then return the user with the token.
        return res.status(200).json({result: newUser, token: token });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
};