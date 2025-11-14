import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Leaderboard() {
  const { leaderboard } = useParams();
  const [users, setUsers] = useState([]);
  const [yourStats, setYourStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://146.88.41.51:8998/leaderboard?minigame_type=survival",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
          }
        );

        const data = response.data;
        const leaderboardType = leaderboard || "weekly";
        const leaderboardData = data[leaderboardType];

        setUsers(leaderboardData?.top_10 || []);
        setYourStats(leaderboardData?.your_stats || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboard]);

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
    leaderboard?.charAt(0).toUpperCase() + leaderboard?.slice(1) || "Weekly";

  return (
    <div className="App">
      <div className="py-2 container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse center" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item ps-5 pe-5">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/leaderboard/daily",
                    }}
                  >
                    Daily
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={{
                      pathname: "/leaderboard/weekly",
                    }}
                  >
                    Weekly
                  </Link>
                </li>
                <li className="nav-item ps-5 pe-5">
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
              </ul>
            </div>
          </div>
        </nav>
        <div className="row">
          <div className="col-12">
            <h2 className="h2 fw-bold">{leaderboardTitle} Leaderboard</h2>
          </div>

          {/* Your Stats Section */}
          {yourStats && (yourStats.rank !== null || yourStats.username) && (
            <div className="col-12 mb-4">
              <div className="alert alert-info">
                <strong>Your Stats:</strong> Rank #{yourStats.rank} - Score:{" "}
                {yourStats.score}
              </div>
            </div>
          )}

          <div className="col-12">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : currentUsers.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr className="cursor-pointer" key={index}>
                      <td>{user.rank}</td>
                      <td>{user.username}</td>
                      <td>{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              )}
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

export default Leaderboard;
