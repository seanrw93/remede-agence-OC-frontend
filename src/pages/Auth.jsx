import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, logout, signupUser, setLoading } from "../store/auth/authSlice";
import { useValidationUtils } from "../utils/validationUtils";
import { useDebouncer } from "../utils/useDebouncer"
import { formatName } from "../utils/formatName";

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState(localStorage.getItem("password") || "");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("email") ? true : false);

    const { token, loading, error } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const { validateInputs, clearErrors } = useValidationUtils({ passwordLength: isLogin ? 0 : 8 })

    const handleAuth = async (e) => {
        e.preventDefault();
        const refs = [firstNameRef, lastNameRef, emailRef, passwordRef];
        const isValid = validateInputs(refs);
    
        if (!isValid) return;
    
        const credentials = isLogin
            ? { email, password }
            : { email, password, firstName: formatName(firstName), lastName: formatName(lastName) };
    
        const resultAction = await dispatch(
            isLogin ? loginUser(credentials) : signupUser(credentials)
        );
    
        if (resultAction.meta.requestStatus === "fulfilled") {
            if (!isLogin) {
                // Automatically log the user in after signup
                const loginResult = await dispatch(loginUser({ email, password }));
                if (loginResult.meta.requestStatus === "fulfilled") {
                    console.log("User logged in successfully after signup");
                    navigate("/profile");
                } else {
                    console.error("Failed to log in after signup:", loginResult.payload);
                }
            } else {
                console.log("User logged in successfully");
                navigate("/profile");
            }
        } else {
            console.error("Signup/Login failed:", resultAction.payload);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    }

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    useEffect(() => {  
        if (token) {
            console.log("Token exists, redirecting to profile...");
            navigate("/profile");
        } else {
            console.log("No token found, logging out...");
            dispatch(logout());
        }
    }, [token, loading, navigate, dispatch]);

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
        } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
        }
    }, [email, password, rememberMe]);

    useEffect(() => {
        // Reset form fields
        setEmail(localStorage.getItem("email") || "");
        setPassword("");
        setFirstName("");
        setLastName("");
        
        // Clear validation errors for all input fields
        clearErrors(firstNameRef);
        clearErrors(lastNameRef);
        clearErrors(emailRef);
        clearErrors(passwordRef);
    }, [isLogin]);

    return (
        //Load page only if token not found, otherwise redirect to profile page
        <>
            {!token && (
                <main class="bg-dark">
                    <section className="sign-in-content bg-dark">
                        <i className="fa fa-user-circle sign-in-icon"></i>
                        <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
                        <form onSubmit={handleAuth}>
                            {!isLogin && (
                                <>
                                    <div className="input-wrapper">
                                        <label htmlFor="first-name">First Name</label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            name="first-name"
                                            value={firstName}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                clearErrors(firstNameRef);
                                            }}
                                            ref={firstNameRef}
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="last-name">Last Name</label>
                                        <input
                                            type="text"
                                            id="last-name"
                                            name="last-name"
                                            value={lastName}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                clearErrors(lastNameRef);
                                            }}
                                            ref={lastNameRef}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="input-wrapper">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearErrors(emailRef);
                                    }}
                                    ref={emailRef}
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="password">Password</label>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearErrors(passwordRef);
                                    }}
                                    ref={passwordRef}
                                />
                                <button type="button" onClick={togglePasswordVisibility} class="showhide-password">
                                    {isPasswordVisible
                                        ? <i class="fa fa-eye-slash"></i>
                                        : <i class="fa fa-eye"></i>
                                    }
                                </button>
                            </div>
                            {isLogin && (
                                <>
                                    <div className="input-remember">
                                        <input
                                            type="checkbox"
                                            id="remember-me"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe((prev) => !prev)}
                                        />
                                        <label htmlFor="remember-me">Remember me</label>
                                    </div>
                                    {error && <div className="error-message">{error}</div>}
                                </>
                            )}
                            <button type="submit" className="sign-in-button" disabled={loading}>
                                {isLogin ? "Sign In" : "Sign Up"}
                            </button>
                        </form>
                        <a href="#" onClick={() => setIsLogin((prev) => !prev)}>
                            {isLogin ? "Don't have an account? Sign up now!" : "Already registered? Log in here!"}
                        </a>
                    </section>
                </main>
            )}
        </>
    );
};