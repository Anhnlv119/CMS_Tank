import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "./header.jsx";

function Leaderboard() {
  const { leaderboard } = useParams();
  const [users, setUsers] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [minigameType, setMinigameType] = useState("survival");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Memoize fetch function to prevent recreating on every render
  const fetchLeaderboard = useCallback(async () => {
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
        `http://146.88.41.51:8998/leaderboard/get?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );
      setUsers(response.data.data.entries || []);
      setCurrentPage(1); // Reset to first page on new data
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [leaderboard, minigameType, sortBy, sortOrder, date]);

  // Only fetch when leaderboard type changes (tab change)
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleSearch = () => {
    fetchLeaderboard();
  };

  const handleReset = () => {
    setDate(today);
    setMinigameType("survival");
    setSortBy("score");
    setSortOrder("desc");
    setCurrentPage(1);
    fetchLeaderboard();
  };

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentUsers,
    };
  }, [users, currentPage, itemsPerPage]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(paginationData.totalPages, prev + 1));
  }, [paginationData.totalPages]);

  const goToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const leaderboardTitle =
    leaderboard?.charAt(0).toUpperCase() + leaderboard?.slice(1) || "Week";

  return (
    <div className="App">
      <div className="py-2 container">
        <Header />

        <div className="row">
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
                    <button
                      className="btn btn-primary"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? "LOADING..." : "SEARCH"}
                    </button>
                  </div>

                  <div className="col-auto">
                    <button
                      className="btn btn-light border"
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <table className="table table-sm mb-0">
                  <thead>
                    <tr className="border-bottom">
                      <th className="fw-bold text-dark py-3">Index</th>
                      <th className="fw-bold text-dark py-3">User Name</th>
                      <th className="fw-bold text-dark py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationData.currentUsers.length > 0 ? (
                      paginationData.currentUsers.map((row, idx) => (
                        <tr
                          key={`${row.player_name}-${idx}`}
                          className="border-bottom"
                        >
                          <td className="py-3">
                            {paginationData.startIndex + idx + 1}
                          </td>
                          <td className="py-3">{row.player_name}</td>
                          <td className="py-3">{row.score}</td>
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
                {paginationData.totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span>
                        Page {currentPage} of {paginationData.totalPages} •
                        Showing {paginationData.currentUsers.length} of{" "}
                        {users.length} users
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
                          { length: paginationData.totalPages },
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
                            currentPage === paginationData.totalPages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={handleNextPage}
                            disabled={currentPage === paginationData.totalPages}
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
