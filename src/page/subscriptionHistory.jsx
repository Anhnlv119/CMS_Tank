import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { getToken, getUserRoles } from "../utils/sessionManager";
import Sidebar from "./sidebar.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function SubscriptionHistory() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [users, setUsers] = useState([]);
  const [msisdn, setMsisdn] = useState("");
  const [limit] = useState();
  const [offset] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { params } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const roles = getUserRoles();

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
        `https://tank-war.mascom.vn/api/package/packages/transactions?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        },
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

  const exportToExcel = () => {
    console.log("Exporting to Excel:", users);
    // Chuyển data thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(users);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SubscriptionHistory");

    // Ghi file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "listSubscriptionHistory.xlsx");
  };

  const MAX_VISIBLE_PAGES = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPage = (page) => setCurrentPage(page);

  const getPageNumbers = () => {
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    if (end - start < MAX_VISIBLE_PAGES - 1) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const totalValue = users.reduce((acc, row) => acc + parseInt(row.price), 0);

  return (
    <div className="App">
      <div className="d-flex flex-column flex-md-row min-vh-100">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-4">
          <h1 className="display-5 fw-bold text-dark mb-4">
            SUBSCRIPTION PURCHASE HISTORY
          </h1>
          {roles.includes("adsgr_supervisor") && (
            <button onClick={exportToExcel}>Export to Excel</button>
          )}
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
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchLeaderboard}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
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
                        <td>{startIndex + idx + 1}</td>
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
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-3">
                      <div className="text-muted">
                        Page {currentPage} of {totalPages} • Showing{" "}
                        {currentUsers.length} of {users.length} users
                      </div>

                      <nav>
                        <ul className="pagination mb-0 flex-wrap">
                          {/* PREVIOUS */}
                          <li
                            className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>

                          {/* FIRST PAGE */}
                          {currentPage > 3 && (
                            <>
                              <li className="page-item">
                                <button
                                  className="page-link"
                                  onClick={() => goToPage(1)}
                                >
                                  1
                                </button>
                              </li>
                              <li className="page-item disabled">
                                <span className="page-link">…</span>
                              </li>
                            </>
                          )}

                          {/* PAGE WINDOW */}
                          {getPageNumbers().map((page) => (
                            <li
                              key={page}
                              className={`page-item ${currentPage === page ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => goToPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                          {/* LAST PAGE */}
                          {currentPage < totalPages - 2 && (
                            <>
                              <li className="page-item disabled">
                                <span className="page-link">…</span>
                              </li>
                              <li className="page-item">
                                <button
                                  className="page-link"
                                  onClick={() => goToPage(totalPages)}
                                >
                                  {totalPages}
                                </button>
                              </li>
                            </>
                          )}

                          {/* NEXT */}
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
    </div>
  );
}
