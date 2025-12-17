import { createBrowserRouter, redirect } from "react-router-dom"
import Login from "../page/login.jsx"
import ListUsers from "../page/userList.jsx"
import Leaderboard from "../page/leaderboard.jsx"
import SubscriptionHistory from "../page/subscriptionHistory.jsx"
import { isSessionValid, clearAuth } from "../utils/sessionManager"
import PackageStatistics from "../page/packageStatistics.jsx"

// Loader function to check authentication
const checkAuth = () => {
  if (!isSessionValid()) {
    clearAuth();
    return redirect('/login');
  }
  return null;
};

const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            if (isSessionValid()) {
                return redirect('/home')
            } else {
                return redirect('/login')
            }
        }
    },
    {
        path: '/leaderboard/:leaderboard',
        element: <Leaderboard />,
        loader: checkAuth
    },
    {
        path: '/login',
        element: <Login />,
        loader: () => {
            if (isSessionValid()) {
                return redirect('/home')
            }
            return null
        }
    },
    {
        path: '/subscription-history',
        element: <SubscriptionHistory />,
        loader: checkAuth
    },
    {
        path: '/home',
        element: <ListUsers />,
        loader: checkAuth
    },
    {
        path: '/package-statisticsry',
        element: <PackageStatistics />,
        loader: checkAuth
    }
], {
    basename: '/CMS_Tank/'
})

export default router