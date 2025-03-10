import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';

export const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async() => {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in");
                setLoading(false);
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
                return;
            }

            try {
                const response = await axios.get("http://localhost:3001/api/v1/user/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Toen expired, redirecting to login page...");
                        localStorage.removeItem("token");
                        window.location.href = "/auth";
                    }
                }

                const data = await response.json();
                setUserData(data);

            } catch (error) {
                setError(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);

    return (
        <>
            <h1>User Profile</h1>
            <div>
                { loading && <div>Loading...</div> }
                { JSON.stringify(userData, null, 2) || {error} }
            </div>
        </>
    )
}
