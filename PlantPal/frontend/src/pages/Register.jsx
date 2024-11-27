import api from "../utils/axios";

// Components
import { PageTemplate } from '../components/Structure.jsx'

// Hooks
import React, { useState } from 'react';

// Icons

export default function Register() {
    return (
        <PageTemplate headerText="Register">
            <div className="flex justify-center items-center w-full h-[90%] text-white text-3xl font-bold">
                <RegisterForm />
            </div>
        </PageTemplate>
    );
}

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    const handleRegister = () => {
        setErrorMessage("");
        setSuccessMessage("");

        // Send registration request to API if validations pass
        api.post('/register', { username, password })
            .then(res => {
                if (res.data.success) {
                    // Show success message if registration is successful
                    setSuccessMessage("Registration successful! Welcome, " + username + "!");
                    
                    // Redirect to the home page after a delay
                    setTimeout(() => {
                        window.location.href = "/"; // Redirect to home
                    }, 500);
                } else {
                    // Handle unsuccessful registration and show error message
                    setErrorMessage("An error occurred during registration. Please try again.");
                }
            })
            .catch(error => {
                console.log(error);
                
                if (error.response) {
                    // Check for specific error messages from the backend
                    setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again later.");
                }
            });
    };

    // Handle the redirect to the login page
    const handleLoginRedirect = () => {
        window.location.href = "login";
    };

    return (
        <div className="flex flex-col gap-4 items-center text-white">
            {/* Success message */}
            {successMessage && (
                <div className="bg-green-500 text-white p-2 rounded mb-4 animate-pop-up">
                    {successMessage}
                </div>
            )}

            {/* Error message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-2 rounded mb-4 animate-pop-up">
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
                onClick={handleRegister}
                className="w-fit px-10 bg-tan-100 text-zuccini-900 py-2 rounded mt-4"
            >
                Register
            </button>

            <button
                onClick={handleLoginRedirect} // Trigger the navigation to the Register page
                className="w-fit px-10  bg-tan-100 text-zuccini-900 py-2 rounded mt-4"
            >
                Login In
            </button>
        </div>
    );
};
