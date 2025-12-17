import React, { memo } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Daily", path: "/leaderboard/day" },
  { label: "Weekly", path: "/leaderboard/week" },
  { label: "Monthly", path: "/leaderboard/month" },
  { label: "User List", path: "/" },
  { label: "Subscription History", path: "/subscription-history" },
  { label: "Package Statistics", path: "/package-statistics" },
];

const Header = memo(() => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse center" id="navbarNav">
            <ul className="navbar-nav">
              {menuItems.map(({ label, path }) => (
                <li
                  key={path}
                  className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2"
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
});

Header.displayName = "Header";

export default Header;
