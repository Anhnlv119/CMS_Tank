import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { getToken } from "../utils/sessionManager";
import Sidebar from "./sidebar.jsx";

const ITEMS_PER_PAGE = 10;
const API_URL = "https://tank-war.mascom.vn/api/package/package-statistics";

export default function PackageStatistics() {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy] = useState("totalTransactions");
  const [sortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: fromDate,
        endDate: toDate,
        sortBy,
        sortOrder,
      });

      const { data } = await axios.get(`${API_URL}?${params}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUsers(data?.statistics || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* Pagination */
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="App">
      <div className="d-flex">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-4">
          <h1 className="display-5 fw-bold text-dark mb-4">
            SUBSCRIPTION PURCHASE HISTORY
          </h1>

          {/* Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label fw-medium">From date</label>
                  <div className="input-group">
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                    <span className="input-group-text">
                      <Calendar size={18} />
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fw-medium">To date</label>
                  <div className="input-group">
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                    <span className="input-group-text">
                      <Calendar size={18} />
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchStatistics}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Package Name</th>
                    <th>Total Transactions</th>
                    <th>Total Money</th>
                    <th>Total Diamond</th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.length ? (
                    currentUsers.map((row, idx) => (
                      <tr key={idx}>
                        <td>{startIndex + idx + 1}</td>
                        <td>{row.packageName}</td>
                        <td>{row.totalTransactions}</td>
                        <td>{row.totalMoney}</td>
                        <td>{row.totalDiamond}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3">
                  <span>
                    Page {currentPage} of {totalPages} • Showing{" "}
                    {currentUsers.length} of {users.length}
                  </span>

                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${currentPage === 1 && "disabled"}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p - 1)}
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
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
