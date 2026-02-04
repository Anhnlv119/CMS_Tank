import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "./sidebar.jsx";

function Leaderboard() {
  const today = new Date().toISOString().split("T")[0];
  const { leaderboard } = useParams();
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(today);
  const [minigameType, setMinigameType] = useState("survival");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboard]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const period = leaderboard || "week";
      const params = new URLSearchParams({
        minigame_type: minigameType,
        period: period,
        sort_by: sortBy,
        sort_order: sortOrder,
        date: date,
      });

      const response = await axios.get(
        `https://tank-war.mascom.vn/api/leaderboard/get?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );
      setUsers(response.data.data.entries || []);
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

  const handleReset = () => {
    setDate(today);
    setMinigameType("survival");
    setSortBy("score");
    setSortOrder("desc");
  };

  // Calculate pagination

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

  const leaderboardTitle =
    leaderboard?.charAt(0).toUpperCase() + leaderboard?.slice(1) || "Week";

  return (
    <div className="App">
      <div className="d-flex">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-4">
          <div className="container-fluid p-4">
            {/* Filter Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4 text-uppercase">
                  RANKING BY {leaderboardTitle}
                </h5>

                <div className="row g-3 align-items-end mb-3">
                  <div className="col-auto">
                    <label className="form-label fw-medium mb-2">Date:</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="form-control"
                      style={{ width: "150px" }}
                    />
                  </div>

                  <div className="col-auto">
                    <label className="form-label fw-medium mb-2">
                      Minigame Type:
                    </label>
                    <select
                      value={minigameType}
                      onChange={(e) => setMinigameType(e.target.value)}
                      className="form-select"
                      style={{ width: "150px" }}
                    >
                      <option value="survival">Survival</option>
                      <option value="arena">Arena</option>
                    </select>
                  </div>

                  <div className="col-auto">
                    <label className="form-label fw-medium mb-2">
                      Sort By:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-select"
                      style={{ width: "150px" }}
                    >
                      <option value="score">Score</option>
                      <option value="damage">Damage</option>
                      <option value="time_survived">Time Survived</option>
                    </select>
                  </div>

                  <div className="col-auto">
                    <label className="form-label fw-medium mb-2">Order:</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="form-select"
                      style={{ width: "120px" }}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>

                  <div className="col-auto">
                    <button className="btn btn-primary" onClick={handleSearch}>
                      SEARCH
                    </button>
                  </div>

                  <div className="col-auto">
                    <button
                      className="btn btn-light border"
                      onClick={handleReset}
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 p-5">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <table className="table table-striped table-hover table-bordered table-sm mb-0 p-4">
                  <thead>
                    <tr className="border-bottom">
                      <th className="fw-bold text-dark py-3">Index</th>
                      <th className="fw-bold text-dark py-3">User Name</th>
                      <th className="fw-bold text-dark py-3">Score</th>
                      <th className="fw-bold text-dark py-3">MSISDN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((row, idx) => (
                        <tr key={idx} className="border-bottom">
                          <td className="py-3">{idx + 1}</td>
                          <td className="py-3">{row.player_name}</td>
                          <td className="py-3">{row.score}</td>
                          <td className="py-3">{row.msisdn}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
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

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
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
                        ))}

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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
