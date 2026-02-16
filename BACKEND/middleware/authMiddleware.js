import jwt from "jsonwebtoken";

// Ye ek function hai jo:
// request ke beech me chalega
// route se pehle execute hoga

// Jahan bhi backend ko ye prove karna ho ki
// “request bhejne wala user already logged-in hai”
// wahan authMiddleware lagega

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
// Browser / Postman jab request bhejta hai, to header me token hota hai:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// Yahin se hum token nikaalte hain.


// Agar token hi nahi bheja:
// matlab user login nahi hai
// isliye direct 401 Unauthorized

    if(!authHeader)
        return res.status(401).json({message:"Authorization header missing"});  

    const token=authHeader.split(" ")[1];
    if(!token)
    {
        return res.status(401).json({message:"Token missing"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
//         JWT verify karta hai:
// token server ne hi banaya tha ya nahi
// token expire to nahi hua
// token tampered to nahi
        req.user={
            userId:decoded.id,
            role:decoded.role
        };
// Ab hum request ke saath user attach kar dete hain
// Ab route ko milega:
// req.user.userId
// req.user.role
        next();
// “Token sahi hai, ab route ko chalne do”
    }
    catch(err)
    {
        return res.status(401).json({message:"Invalid token"});
    }
}

export default authMiddleware;



// Agar middleware NA ho ❌
// app.get("/profile", (req,res)=>{
//    // kaun user?
//    // logged in hai ya nahi?
//    // token fake to nahi?
// })


// 👉 Har route me ye sab likhna padega
// 👉 Code repeat
// 👉 Security risk