import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import api from "./utils/axios";


function Main() {
    const [waiting, setWaiting] = useState(false);
    const [serviceWorker, setServiceWorker] = useState(null);

    useEffect(() => {
        function registerServiceWorker() {
            if (!navigator.serviceWorker) return;

            navigator.serviceWorker.register('/serviceWorker.js')
                .then(registration => {
                    if (!navigator.serviceWorker.controller) return;

                    if (registration.installing) {
                        console.log('Service worker installing');
                    } else if (registration.waiting) {
                        console.log('Service worker installed, but waiting');
                        setServiceWorker(registration.waiting);
                        setWaiting(true);
                    } else if (registration.active) {
                        console.log('Service worker active');
                    }

                    registration.addEventListener('updatefound', () => {
                        console.log('SW update found');
                        setServiceWorker(registration.installing);
                        setWaiting(true);
                    });
                })
                .catch(error => console.error(`Registration failed with error: ${error}`));

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });

            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log(event);
                if (event.data.action === 'navigateOffline') {
                    console.log("Navigating offline")
                    window.location.href = '/offline';
                }

                // if (event.data.action === 'push') {
                //     // Step 1: Retrieve the existing array
                //     const storedArray = localStorage.getItem("notifications");
                //     const parsedArray = storedArray ? JSON.parse(storedArray) : [];

                //     // Step 2: Add (push) the new item
                //     parsedArray.push(event.data.message);

                //     // Step 3: Save the updated array back to localStorage
                //     localStorage.setItem("notifications", JSON.stringify(parsedArray));
                // }
            });
        }
        
        registerServiceWorker();
    }, []);

    const handleDismiss = () => setWaiting(false);

    const handleConfirm = () => {
        if (serviceWorker) {
            serviceWorker.postMessage({ action: 'skipWaiting' });
        }
        setWaiting(false);
    };

    const PUSH_PUBLIC_KEY = 'BHcMfREKANAvK0SLLFNWSqzhro3vc8j2kH-YrKM5TZYR4ZSoPgX-1ULBZE8eIlt1IAdQo5NS6YYvi31rZhC-_Cg'; 

    function subscribeToNotifications(username) {
        // Ask the user to enable notifications
        if (Notification.permission !== 'granted') {
            console.log("Requesting notification permissions...");
            return Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                    console.error("Notification permissions not granted.");
                    return Promise.resolve("Notification permissions not granted.");
                } else {
                    return handleSubscription(username);
                }
            });
        }
    
        return handleSubscription(username);
    }
    
    function handleSubscription(username) {
        console.log("Attempting to subscribe");
    
        if (!navigator.serviceWorker) {
            console.log("Service worker not supported in this Browser.");
            return Promise.reject("Service worker not supported.");
        }
    
        return navigator.serviceWorker.ready
            .then((registration) => {
                console.log("Service worker ready");
                return registration.pushManager.getSubscription()
                    .then((existingSubscription) => {
                        if (existingSubscription) {
                            console.log("Removing existing subscription");
                            return existingSubscription.unsubscribe()
                                .then(() => {
                                    console.log("Existing subscription removed");
                                    return createNewSubscription(registration, username);
                                })
                                .catch((error) => {
                                    console.error("Failed to remove existing subscription: " + error);
                                    throw error;
                                });
                        } else {
                            console.log("No existing subscription found");
                            return createNewSubscription(registration, username);
                        }
                    })
                    .catch((error) => {
                        console.error("Failed to retrieve existing subscription: " + error);
                        throw error;
                    });
            });
    }
    
    function createNewSubscription(registration, username) {
        console.log("Attempting to create a new subscription");
        return registration.pushManager
            .subscribe({
                userVisibleOnly: true, // Push notifications will be visible to the user
                applicationServerKey: PUSH_PUBLIC_KEY,
            })
            .then((subscription) => {
                console.log("Adding new subscription");
                return api.post('/subscribe', { username, subscription })
                    .then(() => {
                        console.log("Successfully subscribed");
                    })
                    .catch((error) => {
                        console.error("Failed to post subscription to server: " + error);
                        throw error;
                    });
            })
            .catch((error) => {
                console.error("Failed to create a new subscription: " + error);
                throw error;
            });
    }


    return (
        <StrictMode>
            <App subscribe={subscribeToNotifications} />
            {waiting && (
                <div className="bg-tan-100 font-light absolute rounded-2xl p-4 shadow-xl space-y-2 bottom-10 right-10 w-fit h-fit">
                    <h3 className="font-base text-xl">Update available</h3>
                    <div className='flex gap-2 items-center justify-center'>
                        <button onClick={handleDismiss} className="bg-zuccini-950/80 text-tan-100 rounded-xl p-2">Dismiss</button>
                        <button onClick={handleConfirm} className="bg-zuccini-950 text-tan-100 rounded-xl p-2">Confirm</button>
                    </div>
                </div>
            )}
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<Main />);
