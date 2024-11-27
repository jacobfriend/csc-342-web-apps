import api from "../utils/axios";

// Components
import { PageTemplate } from '../components/Structure.jsx'

// Hooks
import React, { useState } from 'react';

// Icons

export default function Login(props) {
    return (
        <PageTemplate headerText="Login" >
            <div className="flex justify-center items-center w-full h-[90%] text-white text-3xl font-bold">
                <LoginCard subscribe={props.subscribe}/> 
            </div>
        </PageTemplate>
        
    )
}

const LoginCard = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    const handleLogin = () => {
        setErrorMessage("");
        setSuccessMessage("");

        api.post(`/login`, { username, password })
        .then(res => {
        
            if (res.data.success) {
                // console.log(res);
                // Show success message
                setSuccessMessage(`Welcome, ${username}!`);

                // Subscribe to push notifications (using our JWT)
                props.subscribe(username).then(() => {
                    console.log("Subscription completed successfully, redirecting...")
                    // Redirect to allow user to see the success message
                    setTimeout(() => {
                        window.location.href = "/"; // Redirect to the home page
                    }, 500);
                }).catch((error) => {
                    console.error("Subscription failed:", error);
                    setErrorMessage("Failed to subscribe to notifications. Please try again.");
                });

            } else {
                setErrorMessage("Invalid credentials. Please try again.");
            }
        }).catch(error => {
            console.log(error);
            if (error.response) {
                // Check for specific error messages from the backend
                setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
            }
        });
            
    };

    // Handle the redirect to the register page
    const handleRegisterRedirect = () => {
        window.location.href = "register";
    };

    return (
        <div className="flex flex-col gap-4 items-center text-white">
            {/* Success message */}
            {successMessage && (
                <div className="bg-green-500 text-white p-2 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {/* Error message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            <div>
                <label htmlFor="username" className="block text-lg">
                    Username:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="mt-2 p-2 w-full text-zuccini-900 rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-lg">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-2 p-2 w-full text-zuccini-900 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    required
                />
            </div>

            <button
                onClick={handleLogin}
                className="w-fit px-10 bg-tan-100 text-zuccini-900 py-2 rounded mt-4"
            >
                Login
            </button>

            <button
                onClick={handleRegisterRedirect} // Trigger the navigation to the Register page
                className="w-fit px-10  bg-tan-100 text-zuccini-900 py-2 rounded mt-4"
            >
                Create Account
            </button>
        </div>
    );
}





