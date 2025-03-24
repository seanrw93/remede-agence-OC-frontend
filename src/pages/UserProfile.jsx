import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user/userSlice"
import { setLoading, setError } from "../store/auth/authSlice"
import { AccountCard } from "../components/AccountCard"
import { Spinner } from "../components/Spinner";

import { testAccounts } from '../data/testData';
import { withAuth } from "../utils/withAuth"

import axiosInstance from '../utils/axiosInstance';

const UserProfile = () => {
    const user = useSelector((state) => state.user);
    const { token, loading, error } = useSelector((state) => state.auth)

    const [accounts, setAccounts] = useState(null);
    const [accountsLoading, setAccountsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async() => {
            dispatch(setLoading(true));
            
            try {
                const response = await axiosInstance.post("user/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                
                dispatch(setUser(response.data.body));

            } catch (error) {
                dispatch(setError(error?.response?.data?.message || "An unknown error has occurred"))
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchUserData();
    }, [navigate, dispatch]);

    useEffect(() => {
        //Simulate fetch request data for test accounts
        const fetchAccounts = async () => {
            try {
                const data = await new Promise((resolve) => {
                    setTimeout(() => resolve(testAccounts), 300)
                });
                setAccounts(data);
                setAccountsLoading(true);
            } catch (error) {
                console.error("Error fetching accounts:", error)
            } finally {
                setAccountsLoading(false)
            }
        }

        fetchAccounts();
    }, [dispatch, token])

    const firstName = user?.payload?.firstName;
    const lastName = user?.payload?.lastName;

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                {!error && (
                    <>
                        <main className="main bg-dark">
                            {/* Header Section */}                            
                            <div className="header">
                                <h1>
                                    Welcome back
                                    <br />
                                    {firstName} {lastName}!
                                </h1>
                                <button className="edit-button">Edit Name</button>
                            </div>
    
                            {/* Accounts Section */}
                            <h2 className="sr-only">Accounts</h2>
                            {accounts?.map((account, index) => (
                                <AccountCard
                                    key={index}
                                    id={index}
                                    accountName={account?.accountName}
                                    accountNumber={account?.accountNumber}
                                    balance={account?.balance}
                                    currency={account?.currency}
                                    description={account?.description}
                                    pathTo={`/account/${index}`}
                                />
                            ))}
    
                        </main>
                    </>
                )}
                </>
            )}
        </>
    );
};

export default withAuth(UserProfile, 1000);
