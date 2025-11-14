import { createBrowserRouter, redirect } from "react-router-dom"
// import Home from "../page/ListUsers"
// import PhotoAlbum from "../page/PhotoAlbum"
// import UserInfo from "../page/UserInfo"
import Login from "../page/login.jsx"
import ListUsers from "../page/userList.jsx"
import Leaderboard from "../page/leaderboard.jsx"
const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                console.log(token);
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
])

export default router