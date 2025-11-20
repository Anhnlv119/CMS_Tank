import { createBrowserRouter, redirect } from "react-router-dom"
import Login from "../page/login.jsx"
import ListUsers from "../page/userList.jsx"
import Leaderboard from "../page/leaderboard.jsx"
import SubscriptionHistory from "../page/subscriptionHistory.jsx"
const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            const token = localStorage.getItem('authToken');
            if (token) {
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
            const token = localStorage.getItem('authToken');
            if (!token) {
                return redirect('/login')
            }
            return null
        }
    },
    {
        path: '/login',
        element: <Login />,
        loader: () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                return redirect('/home')
            }
            return null
        }
    },
    {
        path: '/subscription-history',
        element: <SubscriptionHistory />,
        loader: () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                return redirect('/login')
            }
            return null
        }
    },
    {
        path: '/home',
        element: <ListUsers />,
        loader: () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                return redirect('/login')
            }
            return null
        }
    }
], {
    basename: '/CMS_Tank/'
})

export default router