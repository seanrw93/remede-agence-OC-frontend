import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { withAuth } from "../utils/withAuth";

const Transactions = () => {
    const { token } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            {token && (
                <div>Transactions for account {id}</div>
            )}
        </>
    )
}

export default withAuth(Transactions)