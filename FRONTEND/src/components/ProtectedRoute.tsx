import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

interface ProtectedRouteProps{
    allowedRole:"student" | "mentor" | "admin";
    children:JSX.Element;
}

const ProtectedRoute=({allowedRole,children}:ProtectedRouteProps)=>{
    const token=localStorage.getItem("token");
    const role=localStorage.getItem("role");   //particular user jo access krna chahta h uska role extract krrhe h token se

    // agar token hi nhi h mtlb wo login hi nhi h to login page pr bhejo login krne ke liye
    if(!token)
    {
        return <Navigate to="/login" replace/>;
    }

    // agar token h but role match nhi krta
    if(role!==allowedRole)
    {
        return <Navigate to="/" replace/>
    }

    // agar sb sahi h page render
    return children;
}

export default ProtectedRoute;