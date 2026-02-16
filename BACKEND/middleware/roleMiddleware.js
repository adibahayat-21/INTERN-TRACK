// allowedRoles yahin file ke andar define nahi hota
//  ye bahar se pass hota hai, jab hum middleware ko use karte hain

// Isko bolte hain:

//  Function parameter / argument

const roleMiddleware = (allowedRoles) => {
  return (req,res,next)=>{

    // Safety check: agar user ya user ka role hi nhi mila, authMiddleware laga hai ya nahi
    if(!req.user || !req.user.role)
    {
        return res.status(401).json({message:"Unauthorized: user data not found"})
    }

    // role check agar user mil gya to fir uska role check krenge ki jo role se wo aaya h wo existing roles m se koi sa h ya nhi 
    // agar nhi hua to ---
    if(!allowedRoles.includes(req.user.role))
    {
        return res.status(403).json({message:"Access Denied"})
    }
    
    // agar existing role m se hi koi sa role h to --
    next();
  }
}

export default roleMiddleware;