import React, { memo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/sessionManager";

const leaderboardChildren = [
  { label: "Daily", path: "/leaderboard/day" },
  { label: "Weekly", path: "/leaderboard/week" },
  { label: "Monthly", path: "/leaderboard/month" },
];

const menuItems = [
  { label: "User List", path: "/home" },
  { label: "Subscription History", path: "/subscription-history" },
  { label: "Package Statistics", path: "/package-statistics" },
  { label: "Game Account Manager", path: "/game-account-manager" },
  { label: "Create Staff", path: "/create-staff" },
];

const Sidebar = memo(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth(); // remove token/session
    navigate("/login"); // redirect to login
  };

  const [open, setOpen] = useState(true);

  return (
    <div
      className="flex-shrink-0 p-3 border-end"
      style={{ width: "280px", minHeight: "100vh" }}
    >
      <span className="fs-5 fw-semibold d-block mb-3">Dashboard</span>

      <ul className="nav nav-pills flex-column mb-auto">
        {/* Leaderboard Parent */}
        <li className="mb-2">
          <button
            className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
            onClick={() => setOpen(!open)}
          >
            Leaderboard
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

        {/* Other Menu Items */}
        {menuItems.map(({ label, path }) => (
          <li key={path} className="nav-item mb-2">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "link-dark"}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
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
