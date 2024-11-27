import Home from './pages/Home.jsx'
import Plants from './pages/Plants.jsx'
import CreateProfile from './pages/CreateProfile.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register'
import Stats from './pages/Stats'
import Offline from './pages/Offline'
import { PlantsProvider } from './components/PlantsProvider.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useEffect } from 'react';

function App(props) {

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
            <PlantsProvider>
                <Home />    
            </PlantsProvider>
            ),
            errorElement: <NotFound />
        },
        {
            path: '/plants',
            element: (
                <PlantsProvider>
                    <Plants />    
                </PlantsProvider>
            ),
        },
        {
            path: '/create',
            element: <CreateProfile />
        },
        {
            path: '/login',
            element: <Login subscribe={props.subscribe}/>
        },
        {
            path: '/register',
            element: <Register />
        },
        {
            path: '/stats',
            element: <Stats />
        },
        {
            path: '/offline',
            element: <Offline />
        }
    ]);
    
  return (
    <RouterProvider router={router} />
  )
}

export default App
