import React, { useState, useEffect, useRef, use } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, signupUser } from '../store/auth/authSlice'

export const Auth = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("email") ? true : false);

    const { loading, error } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleValidation = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
        const validationCheck = {
            firstNameIsValid: firstName.trim() !== "",
            lastNameIsValid: lastName.trim() !== "",
            emailIsValid: emailPattern.test(email),
            passwordIsValid: isLogin ? password.trim().length >= 0 : password.trim().length >= 8,
        };
    
        const clearErrors = (ref) => {
            if (!ref.current) return;
            const errorMessage = ref.current.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains("error-message")) {
                errorMessage.remove();
            }
            ref.current.style.borderColor = "";
            ref.current.setCustomValidity(""); // Clears any custom validity message
        };
    
        const setErrorMessage = (ref, message) => {
            clearErrors(ref);
            ref.current.insertAdjacentHTML(
                "afterend",
                `<p class="error-message" style="color: red;">${message}</p>`
            );
            ref.current.style.borderColor = "red";
            ref.current.setCustomValidity("");
        };
    
        let isValid = true;
        if (!isLogin) {
            if (!validationCheck.firstNameIsValid) {
                setErrorMessage(firstNameRef, "Please enter your first name");
                isValid = false;
            } else {
                clearErrors(firstNameRef);
            }
    
            if (!validationCheck.lastNameIsValid) {
                setErrorMessage(lastNameRef, "Please enter your last name");
                isValid = false;
            } else {
                clearErrors(lastNameRef);
            }
    
            if (!validationCheck.emailIsValid) {
                setErrorMessage(emailRef, "Please enter a valid email address");
                isValid = false;
            } else {
                clearErrors(emailRef);
            }
        
            if (!validationCheck.passwordIsValid) {
                setErrorMessage(passwordRef, "Password must be at least 8 characters long");
                isValid = false;
            } else {
                clearErrors(passwordRef);
            }
        } else {
            if (!validationCheck.emailIsValid) {
                setErrorMessage(emailRef, "Please enter your email address");
                isValid = false;
            } else {
                clearErrors(emailRef);
            }
        
            if (!validationCheck.passwordIsValid) {
                setErrorMessage(passwordRef, "Please enter your password");
                isValid = false;
            } else {
                clearErrors(passwordRef);
            }
        }
        
        return isValid;
    };
    
    
    const handleAuth = async (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        let credentials = {};
        let resultAction= null;
        if (isLogin) {
            credentials = { email, password };
            resultAction = await dispatch(loginUser(credentials));
        } else {
            credentials = { email, password, firstName, lastName };
            resultAction = await dispatch(signupUser(credentials));
        }

        if (resultAction.meta.requestStatus === 'fulfilled') {
            navigate('/profile');
        } else if (resultAction.meta.requestStatus === 'rejected') {
            console.log(resultAction.payload);
        }
    }

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem("email", email);
        } else {
            localStorage.removeItem("email");
        }
    }, [email, rememberMe]);

    useEffect(() => {
        setEmail(localStorage.getItem("email") || "");
        setPassword("");
        setFirstName("");
        setLastName("");

   // Clear errors for all refs
   [firstNameRef, lastNameRef, emailRef, passwordRef].forEach((ref) => {
    if (ref.current) {
        const errorMessage = ref.current.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
            errorMessage.remove();
        }
        ref.current.style.borderColor = "";
        ref.current.setCustomValidity("");
    }
});

    }, [isLogin]);

    return (
        <main>
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
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
                                    onChange={(e) => setFirstName(e.target.value)}
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
                                    onChange={(e) => setLastName(e.target.value)}
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                            ref={passwordRef}
                        />
                    </div>
                    {isLogin && (
                        <div className="input-remember">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={() => setRememberMe(prev => !prev)}
                            />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                    )}
                    <button type="submit" className="sign-in-button" disabled={loading}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                    {error && <p>{error}</p>}
                </form>
                <a href="#" onClick={() => setIsLogin(prev => !prev)}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
                </a>
            </section>
        </main>
  )
}
