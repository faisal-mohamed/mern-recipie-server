import  express  from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/user.js";
import 'dotenv/config.js'

const router = express.Router();

router.post('/register', async (req,res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username: username}); //Creating a new User instance 
    if(user) {
        return res.json({message: "Oops! User aldready registered. Try out a different username..."})
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({username, password:hashPassword});
    await newUser.save();

    res.json({message: "User successfully registered"});

});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username: username});
    if(!user) {
        return res.json({message: "User does not exist. Register before logging in"});
    }

    const isPasswordValid =await  bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.json({message: "Username or Password is incorrect"});
    }
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET) //Use env variable before production inplace of secret
    res.json({token, userID: user._id});
})

export {router as UserRouter};

//Logic for authorization before performing any create/saved  recipie request
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error) {
               return res.sendStatus(403);
            }
            console.log('Decoded Token:', decodedToken); // Add this line to log the decoded token

            req.user = { id: decodedToken.id };

            next();
        })
    } else {
        res.sendStatus(401);
    }
}
