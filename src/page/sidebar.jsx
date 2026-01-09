import React, { memo, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getToken, getUserRoles } from "../utils/sessionManager";
import axios from "axios";

const leaderboardChildren = [
  { label: "Daily", path: "/leaderboard/day" },
  { label: "Weekly", path: "/leaderboard/week" },
  { label: "Monthly", path: "/leaderboard/month" },
];

const Sidebar = memo(() => {
  const [users, setUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const roles = getUserRoles();
  const isSupervisor = roles.includes("adsgr_supervisor");

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const [open, setOpen] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://146.88.41.51:8998/dashboard/online-users", {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });

      setUsers(response.data.online_users_count || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      className="flex-shrink-0 p-3 border-end"
      style={{ width: "280px", minHeight: "100vh" }}
    >
      <span className="fs-5 fw-semibold d-block mb-3">Dashboard</span>

      <ul className="nav nav-pills flex-column mb-auto">
        {/* USER LIST – ai cũng thấy */}
        <li className="nav-item mb-2">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            User List
          </NavLink>
        </li>

        {/* Leaderboard */}
        <li className="mb-2">
          <button
            className="btn btn-toggle d-inline-flex align-items-center justify-content-between w-100 rounded border-0"
            onClick={() => setOpen(!open)}
          >
            <span>Leaderboard</span>
            <span
              style={{
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ▶
            </span>
          </button>

          {open && (
            <ul className="nav flex-column ms-3 mt-1">
              {leaderboardChildren.map(({ label, path }) => (
                <li key={path} className="nav-item">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `nav-link py-1 ${isActive ? "active" : "link-dark"}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/subscription-history"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            Subscription History
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/package-statistics"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            Package Statistics
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "link-dark"}`
            }
          >
            Stats
          </NavLink>
        </li>
        {/* SUPERVISOR ONLY */}
        {isSupervisor && (
          <>
            <li className="nav-item mb-2">
              <NavLink
                to="/game-account-manager"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "link-dark"}`
                }
              >
                Game Account Manager
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/create-staff"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "link-dark"}`
                }
              >
                Create Staff
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <div>
        <p className="mt-4 mb-2">Total Users: {isLoading ? 'Loading...' : users}</p>
      </div>
      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
