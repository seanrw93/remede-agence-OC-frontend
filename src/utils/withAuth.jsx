import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "../components/Spinner"

export const withAuth = (WrappedComponent, timeout = null) => {
    return (props) => {
        const { token } = useSelector((state) => state.auth); 
        const navigate = useNavigate();
        const dispatch = useDispatch();

        useEffect(() => {
            if (!token) {
                console.error("Not logged in. Redirecting...")
                !timeout ? navigate("/") : setTimeout(() => navigate("/"), timeout);
            }
        }, [token, navigate, dispatch, timeout]);

        if (!token) {
            if (timeout) {
                return <Spinner />
            } else {
                return null;
            }
        }

        return <WrappedComponent {...props} />;
    };
};