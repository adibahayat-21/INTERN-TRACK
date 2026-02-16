import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import UserModel from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// ================= New User registration ========================

const register_user = async (req, res) => {
    const { name, email, password , role, department} = req.body;

    // check if email already exists
    // findOne() method returns promise so for this we have to use async aur await 
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser)
        return res.status(400).json({ message: "Email already exists" });

    // if the email is not exists already then make new user of that email
    const hashedPassword = await bcrypt.hash(password, 10);
    // yha pr agar wo new user ki id humne manually nhi di to fir wo apne aap hi generate ho jayegi mongodb ke through
    const newUser = new UserModel({ name, email, password: hashedPassword, role, department });
    console.log("register body:",req.body);
    await newUser.save();
    res.status(201).json({ message: "user registered successfully" });
}

// ================= Existing User login ========================

// token is only used at the time of login

// “I used stateless JWT-based authentication instead of server-side sessions for better scalability.”
// “Main wahi user hoon jo pehle register hua tha, prove kar raha hoon”
// Is time:
// email + password verify hote hain
// identity confirm hoti hai
// tab hi token milta hai
// Token = proof of identity

const login_user = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });  //jo email login kar raha hai, wo DB me hai ya nahi wo check krna h
    if (existingUser)   //agar user mil jata hai DB me
    {
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);   //password check krenge ki usne whi password dala hai ya nahi
        if (isPasswordCorrect) {
            //JWT token generate krne ke liye function call
            const token = generateToken(existingUser);
            res.status(200).json({ message: "Login successful", token: token, role: existingUser.role }); //token bhej denge response me
            // DB se role nikalta hai
            // frontend ko bhej deta hai
            // Isliye frontend ko login form me role poochne ki zarurat hi nahi.
        }
        else
            return res.status(400).json({ message: "Invalid credentials" });
    }
    else {
        console.log("User Not Found");
        return res.status(400).json({ message: "User not found" });
    }
}

// ================== Showing the detail of the user =====================

const userMe=async(req,res)=>{
    try{
        const userId=req.user.userId;
        const user=await UserModel.findById(userId).select("name email role createdAt department")

        if(!user)
            return res.status(404).json({message:"User not found"})

        res.status(200).json(user);
    }catch(error)
    {
        res.status(500).json({message:"Failed to fetch user profile"})
    }
}

export { register_user, login_user , userMe};