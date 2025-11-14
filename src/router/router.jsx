import { createBrowserRouter, redirect } from "react-router-dom"
import Login from "../page/login.jsx"
import ListUsers from "../page/userList.jsx"
import Leaderboard from "../page/leaderboard.jsx"

const isTokenValid = () => {
    const token = localStorage.getItem('authToken');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !tokenExpiration) {
        return false;
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(tokenExpiration)) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        return false;
    }
    
    return true;
};

const router = createBrowserRouter(
    [
        {
            path: '/',
            loader: () => {
                if (isTokenValid()) {
                    return redirect('/home')
                } else {
                    return redirect('/login')
                }
            }
        },
        {
            path: '/leaderboard/:leaderboard',
            element: <Leaderboard />,
            loader: () => {
                if (!isTokenValid()) {
                    return redirect('/login')
                }
                return null
            }
        },
        {
            path: '/login',
            element: <Login />,
            loader: () => {
                if (isTokenValid()) {
                    return redirect('/home')
                }
                return null
            }
        },
        {
            path: '/home',
            element: <ListUsers />,
            loader: () => {
                if (!isTokenValid()) {
                    return redirect('/login')
                }
                return null
            }
        },
        {
            path: '*',
            loader: () => redirect('/login')
        }
    ],
    {
        basename: import.meta.env.DEV ? '/' : '/your-repo-name'
    }
)

export default router