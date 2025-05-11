import React, { useState, useEffect, Suspense } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateUserName } from "../store/user/userSlice"
import { setLoading, setError } from "../store/auth/authSlice"
import { Spinner } from "../components/Spinner";
import { withAuth } from "../utils/withAuth"
import { formatName } from '../utils/formatName';

const AccountCard = React.lazy(() => import("../components/AccountCard"))

import { fetchUserProfileData } from '../services/apiServices/userData';
import { fetchAccountData } from '../services/apiServices/accountData';

const UserProfile = () => {
    const user = useSelector((state) => state.user);
    const { token, loading, error } = useSelector((state) => state.auth);

    
    const firstName = useSelector((state) => state.user.payload?.firstName || "First Name");
    const lastName = useSelector((state) => state.user.payload?.lastName || "Last Name");

    const [accounts, setAccounts] = useState(null);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false)
    const [newNames, setNewNames] = useState({
        newFirstName: firstName || "",
        newLastName: lastName || ""
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getUserData = async() => {
            dispatch(setLoading(true));
            
            try {
                const userData = await fetchUserProfileData(token)
                dispatch(setUser(userData));
            } catch (error) {
                dispatch(setError(error?.response?.data?.message || "An unknown error has occurred"))
            } finally {
                dispatch(setLoading(false));
            }
        }
        getUserData();
    }, [navigate, dispatch]);

    useEffect(() => {
        if (user?.payload) {
            setNewNames({
                newFirstName: user.payload.firstName || "",
                newLastName: user.payload.lastName || "",
            });
        }
    }, [user.payload]);

    useEffect(() => {
        //Simulate fetch request data for test accounts
        const getAccounts = async () => {
            try {
                const accountData = await fetchAccountData();
                setAccounts(accountData);
                setAccountsLoading(true);
            } catch (error) {
                console.error("Error fetching accounts:", error)
            } finally {
                setAccountsLoading(false)
            }
        }

        getAccounts();
    }, [dispatch, token])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const credentials = {
            firstName: formatName(newNames.newFirstName),
            lastName: formatName(newNames.newLastName),
            updatedAt: new Date().toISOString()
        };

        try {
            await dispatch(updateUserName(credentials));
            console.log("Name updated succesfully");
            setNewNames({
                newFirstName: formatName(newNames.newFirstName),
                newLastName: formatName(newNames.newLastName),
            });
            window.location.reload();
        } catch (error) {
            console.error("failed to update name: ", error);
            alert("Failed to update name");
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setNewNames({
            newFirstName: firstName,
            newLastName: lastName,
        })
    };

    const handleNames = (e) => {
        const { name, value } = e.target;
        setNewNames((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

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
                                    {!editMode ? (
                                        <button className="edit-button" onClick={() => setEditMode(true)}>
                                            Edit Name
                                        </button> 
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <p>Want to change your name? Type in your new name here</p>
                                            <div className="edit-names-container">
                                                <input 
                                                    type="text"
                                                    name="newFirstName"
                                                    value={newNames.newFirstName}
                                                    onChange={handleNames}
                                                />
                                                <input 
                                                    type="text"
                                                    name="newLastName"
                                                    value={newNames.newLastName}
                                                    onChange={handleNames}
                                                />                                            </div>
                                            <div className="edit-buttons-container">
                                                <button 
                                                    type="submit" 
                                                    className="edit-button edit-button--submit">
                                                        Confirm
                                                    </button>
                                                <button 
                                                    type="button" 
                                                    className="edit-button edit-button--cancel"
                                                    onClick={handleCancel}>
                                                        Cancel
                                                    </button>
                                            </div>
                                        </form>
                                    )}                                   
                                </div>
        
                                {/* Accounts Section */}
                                <h2 className="sr-only">Accounts</h2>
                                <Suspense fallback={<Spinner />}>
                                    {accounts?.map((account, index) => (
                                        <AccountCard
                                            key={index}
                                            accountName={account?.accountName}
                                            accountNumber={account?.accountNumber}
                                            balance={account?.balance}
                                            currency={account?.currency}
                                            description={account?.description}
                                            pathTo={`/account/${account?.id}`}
                                        />
                                    ))}
                                </Suspense>
                            </main>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default withAuth(UserProfile, 1000);
