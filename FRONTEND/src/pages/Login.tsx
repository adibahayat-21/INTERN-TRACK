import { useState } from "react";
import "../styles/login.css"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import type { Role } from "../context/AuthContext";


const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const [password, setPassword] = useState("");
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }
        // api call to login the user
        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data: { message?: string; token?: string; role?: Role; } = await response.json();
            if (!response.ok) {
                toast.error(data.message || "Login failed");
                return;
            }
            if (!data.token || !data.role) {
                toast.error("Invalid login response");
                return;
            }
            // !token ka matlab hoga token nahi hai , value check
            // token! ka matlab hoga token null nahi hoga (datatype se related), type check

            login(data.token, data.role)   //! iska mtlb ki token null nhi hoga yeh gaurantee h 
            toast.success("Login successful");
            if (data.role === "student")
                navigate("/student-dashboard");
            else if (data.role === "mentor")
                navigate("/mentor-dashboard")
            else if (data.role === "admin")
                navigate("/admin-dashboard")
        }
        catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <div className="login-page">
                <div className="login-card">

                    {/* BRAND / BADGE */}
                    <div className="login-brand">
                        <span className="login-logo">I</span>
                        <h3>INTERN-TRACK</h3>
                    </div>

                    {/* TEXT */}
                    <h2>Welcome back</h2>
                    <p className="login-subtext">
                        Login to your INTERN-TRACK account
                    </p>

                    {/* FORM */}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => handleEmail(e)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => handlePassword(e)}
                        />

                        <button type="submit">
                            Login
                        </button>
                    </form>

                    {/* FOOTER */}
                    <div className="login-footer">
                        Don’t have an account? <a href="/register">Register</a>
                    </div>
                    <div className="login-footer">
                        <a href="/">Back to Home</a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login