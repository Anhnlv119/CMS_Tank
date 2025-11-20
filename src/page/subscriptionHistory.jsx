import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
export default function SubscriptionHistory() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [users, setUsers] = useState([]);
  const [msisdn, setMsisdn] = useState("");
  const [limit, setLimit] = useState();
  const [offset, setOffset] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { params } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchLeaderboard();
  }, [params]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        msisdn: msisdn,
        startDate: fromDate,
        endDate: toDate,
        limit: limit,
        offset: offset,
      });

      const response = await axios.get(
        `http://146.88.41.51:8998/package/packages/transactions?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );
      setUsers(response.data.data.transactions || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLeaderboard();
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalValue = users.reduce((acc, row) => acc + parseInt(row.price), 0);

  return (
    <div className="min-vh-100 bg-light p-5 pt-1">
      <div className="container-lg">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse center" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/leaderboard/day",
                    }}
                  >
                    Daily
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/leaderboard/week",
                    }}
                  >
                    Weekly
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/leaderboard/month",
                    }}
                  >
                    Monthly
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/",
                    }}
                  >
                    User List
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5 btn btn-outline-secondary ms-2 me-2">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/subscription-history",
                    }}
                  >
                    Subscription History
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <hr />
        <h1 className="display-5 fw-bold text-dark mb-4">
          SUBSCRIPTION PURCHASE HISTORY
        </h1>

        {/* Filter Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label fw-medium">From date:</label>
                <div className="input-group">
                  <input
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="form-control"
                  />
                  <span className="input-group-text">
                    <Calendar className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-medium">To date:</label>
                <div className="input-group">
                  <input
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="form-control"
                  />
                  <span className="input-group-text">
                    <Calendar className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-medium">User name:</label>
                <input
                  type="text"
                  value={msisdn}
                  onChange={(e) => setMsisdn(e.target.value)}
                  placeholder="Enter username"
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-3">
                <button className="btn btn-primary w-100" onClick={handleSearch}>SEARCH</button>
              </div>
            </div>

            <div className="mt-3 fw-semibold">
              Total value: <span className="text-danger">{totalValue}</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold">STT</th>
                  <th className="fw-semibold">Username</th>
                  <th className="fw-semibold">Transaction ID</th>
                  <th className="fw-semibold">Price</th>
                  <th className="fw-semibold">Package code</th>
                  <th className="fw-semibold">Created date</th>
                  <th className="fw-semibold">Source</th>
                  <th className="fw-semibold">Message</th>
                  <th className="fw-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row.msisdn}</td>
                      <td>
                        <code>{row.transactionId}</code>
                      </td>
                      <td>{row.price}</td>
                      <td>{row.packageCode}</td>
                      <td className="text-nowrap">{row.createdAt}</td>
                      <td>{row.packageType}</td>
                      <td>{row.packageName}</td>
                      <td>
                        <span className="text-info fw-medium">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span>
                    Page {currentPage} of {totalPages} • Showing{" "}
                    {currentUsers.length} of {users.length} users
                  </span>
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
