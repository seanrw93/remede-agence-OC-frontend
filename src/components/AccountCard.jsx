import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import "../styles/main.css"

export const AccountCard = (
  { accountName, 
    accountNumber, 
    balance, 
    currency, 
    description,
    pathTo 
  }) => {

  const navigate = useNavigate();

  return (
    <section className="account">
        <div className="account-content-wrapper">
            <h3 className="account-title">Argent {accountName} ({accountNumber})</h3>
            <p className="account-amount">{formatCurrency(balance, currency)}</p>
            <p className="account-amount-description">{description}</p>
        </div>
        <div className="account-content-wrapper cta">
            <button onClick={() => navigate(pathTo)} className="transaction-button">View transactions</button>
        </div>
    </section>
  )
}