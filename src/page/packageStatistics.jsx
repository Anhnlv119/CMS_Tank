import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { getToken } from "../utils/sessionManager";
import Header from "./header.jsx";
export default function PackageStatistics() {
    const [users, setUsers] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [sortBy, setSortBy] = useState("totalTransactions");
    const [limit, setLimit] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
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
        startDate: fromDate,
        endDate: toDate,
        sortBy: sortBy,
        sortOrder: sortOrder,
        limit: limit,
      });

      const response = await axios.get(
        `http://146.88.41.51:8998/package/package-statistics?${params.toString()}`,
        {
          headers: {
          Authorization: "Bearer " + getToken(),
          },
        }
      );
      setUsers(response.data.statistics || []);
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


  return (
    <div className="min-vh-100 bg-light p-5 pt-1">
      <div className="container-lg">
            <Header />    
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
                <button className="btn btn-primary w-100" onClick={handleSearch}>SEARCH</button>
              </div>
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
                  <th className="fw-semibold">Package name</th>
                  <th className="fw-semibold">Total transaction</th>
                  <th className="fw-semibold">Total money</th>
                  <th className="fw-semibold">Total diamond</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row.packageName}</td>
                      <td>{row.totalTransactions}</td>
                      <td>{row.totalMoney}</td>
                      <td>{row.totalDiamond}</td>
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
