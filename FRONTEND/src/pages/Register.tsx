import { useState } from "react";
import "../styles/register.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import type { Role } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const {login}=useAuth();
    const [name, setName] = useState("");
    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const [email, setEmail] = useState("");
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const [password, setPassword] = useState("");
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const [role, setRole] = useState("");
    const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
    }

    const [department, setDepartment] = useState("");
    const handleDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDepartment(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !role) {
            toast.error("All Fields are required");
            return;
        }
        if (role === "mentor" && !department) {
            toast.error("Please select a department");
            return;
        }

        // api call to register the user
        // (Register → Auto-Login)
        // Register kare → automatically login ho → dashboard open
        // Register API → Login API → token + role

        try {
            const register_response = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, role, department: role === "mentor" ? department : undefined })
            })
            const data: { message?: string } = await register_response.json();
            if (!register_response.ok) {
                toast.error(data.message || "Registration failed");
                return;
            }

            // ---------- auto login after registration -------------
            const login_response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const loginData: {
                token?: string;
                role?: Role;
                message?: string;
            } = await login_response.json();

            if (!login_response.ok) {
                toast.error(loginData.message || "login failed")
                return;
            }

            if (!loginData.token || !loginData.role) {
                toast.error("Invalid login response");
                return ;
            }
            login(loginData.token,loginData.role)
            toast.success("Registration & logged in successful");
            /* -------------------- STEP 4: ROLE-BASED REDIRECT -------------------- */

            if (loginData.role === "student") {
                navigate("/student-dashboard");
            } else if (loginData.role === "mentor") {
                navigate("/mentor-dashboard");
            } else if (loginData.role === "admin") {
                navigate("/admin-dashboard");
            }
        } catch {
            toast.error("Something went wrong");
        }
        console.log(name, email, password, role, department);
    }

    return (
        <>
            <div className="register-page">

                <div className="register-card">

                    <div className="register-brand">
                        <span className="register-logo">I</span>
                        <h3>INTERN-TRACK</h3>
                    </div>

                    {/* text */}
                    <h2>Create your account</h2>
                    <p className="register-subtext">
                        Register to start your internship journey with us!
                    </p>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => handleName(e)} />
                        <input type="email" placeholder="email address" value={email} onChange={(e) => handleEmail(e)} />
                        <input type="password" placeholder="password" value={password} onChange={(e) => handlePassword(e)} />
                        {/* role */}
                        <select value={role} onChange={(e) => handleRole(e)}>
                            <option value="">Select role</option>
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                        </select>

                        {/* if the user selects mentor then only shows this to select the department */}
                        {role === "mentor" && (
                            <select value={department} onChange={(e) => handleDepartment(e)}>
                                <option value="">Select department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Data Science">Data Science</option>
                                <option value="IT">IT</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="Cyber">Cyber</option>
                            </select>
                        )}
                        <button type="submit">Register</button>
                    </form>

                    {/* FOOTER */}
                    <div className="register-footer">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                    <div className="register-footer">
                        <a href="/">Back to Home</a>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Register;