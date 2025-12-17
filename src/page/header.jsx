import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/leaderboard/day">
                  Daily
                </Link>
              </li>

              <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/leaderboard/week">
                  Weekly
                </Link>
              </li>

              <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/leaderboard/month">
                  Monthly
                </Link>
              </li>

              <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/">
                  User List
                </Link>
              </li>

              <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/subscription-history">
                  Subscription History
                </Link>
              </li>
              
               <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                <Link className="nav-link active" to="/subscription-history">
                    SUBSCRIPTION PURCHASE HISTORY
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
}
