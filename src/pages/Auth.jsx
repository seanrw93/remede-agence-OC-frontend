import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../store/auth/authSlice";
import { useValidationUtils } from "../utils/validationUtils";

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState(localStorage.getItem("password") || "");
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

    const { validateInputs, clearErrors } = !isLogin ? useValidationUtils({ passwordLength: 8 }) : useValidationUtils();

    const handleAuth = async (e) => {
        e.preventDefault();
        const refs = [firstNameRef, lastNameRef, emailRef, passwordRef];
        const isValid = validateInputs(refs);

        if (!isValid) return;

        const credentials = isLogin
            ? { email, password }
            : { email, password, firstName, lastName };

        const resultAction = await dispatch(
            isLogin ? loginUser(credentials) : signupUser(credentials)
        );

        if (resultAction.meta.requestStatus === "fulfilled") {
            navigate("/profile");
        } else if (resultAction.meta.requestStatus === "rejected") {
            console.log(resultAction.payload);
        }
    };


    useEffect(() => {
        if (rememberMe && token) {
            navigate("/profile")
        }
    }, [rememberMe, token, navigate])

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
        <main>
            <section className="sign-in-content">
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
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearErrors(passwordRef);
                            }}
                            ref={passwordRef}
                        />
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
    );
};