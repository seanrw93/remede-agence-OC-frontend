import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearUser } from "../store/user/userSlice"
import { setLoading, logout } from "../store/auth/authSlice"

export const Header = () => {

    const user = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const firstName = user?.payload?.firstName;


    const handleLogout = async () => {
        try {
            dispatch(clearUser());
            dispatch(logout()); 
            dispatch(setLoading(true)); 
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <header>
            <nav className="main-nav">
                <Link className="main-nav-logo" to="/">
                    <img
                    className="main-nav-logo-image"
                    src="/assets/images/icons/argentBankLogo.png"
                    alt="Argent Bank Logo"
                    />
                    <h1 className="sr-only">Argent Bank</h1>
                </Link>
                {token ? (
                    <div>
                        <Link className="main-nav-item" to="/profile" >
                            <i className="fa fa-user-circle"></i>
                            {firstName}
                        </Link>
                        <a href="javascript:void(0)"
                            role="button"
                            className="main-nav-item" 
                            onClick={handleLogout}>
                            <i className="fa fa-sign-out"></i>
                            Sign Out
                        </a>
                    </div>
                ) : (
                    <div>
                        {location.pathname === "/" && (
                            <Link className="main-nav-item" to="/auth">
                                <i className="fa fa-sign-in"></i>
                                Sign In
                            </Link>                        
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};