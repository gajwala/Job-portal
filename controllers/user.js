
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { validateEmail } from '../helper/validation.js';

export const register =async (req,res)=>{

    try {
        const { email, password, role, skills, githubProfile, contactInfo } = req.body;

        if(!validateEmail(email)){
           res.status(400).json({message:'Invalid credentials'})
        }
        const oldUser = await User.findOne({email});
        if(oldUser){
            res.status(400).json({message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role, skills, githubProfile, contactInfo });
        await user.save();
        res.status(201).send(user);
        
    } catch (error) {
        res.status(500).json({
            message:error.message
           }) 
    }

  
}

export const login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({message:'Invalid credentials'});
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({message:'Invalid credentials'});
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        const { password: userPassword, ...userWithoutPassword } = user._doc;
        res.send({ token,user:userWithoutPassword });
    } catch (error) {
       res.status(500).json({
        message:error.message
       }) 
    }
  
}