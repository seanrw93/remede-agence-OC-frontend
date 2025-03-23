import { useEffect } from "react"
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export const Transactions = () => {
    const { token } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.log("User not logged in. redirecting to homepage...")
            navigate("/")
        }
    }, [token, navigate])

    return (
        <>
            {token && (
                <div>Transactions for account {id}</div>
            )}
        </>
    )
}