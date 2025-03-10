import React, { useState, useEffect, use } from 'react'
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

    const handleAuth = async (e) => {
        e.preventDefault();
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
                                    required
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
                                    required
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
                            required
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
                            required
                        />
                    </div>
                    <div className="input-remember">
                        <input
                            type="checkbox"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={() => setRememberMe(prev => !prev)}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button type="submit" className="sign-in-button" disabled={loading}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                    {error && <p>{error}</p>}
                </form>
                <a href="javascript:void(0)" onClick={() => setIsLogin(prev => !prev)}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
                </a>
            </section>
        </main>
  )
}
