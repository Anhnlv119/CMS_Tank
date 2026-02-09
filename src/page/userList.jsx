import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../utils/sessionManager";
import Sidebar from "./sidebar.jsx";

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [username, setUsername] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://tank-war.mascom.vn/api/dashboard/get-player-inventory", {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (code, banned) => {
    console.log(code + "----" + banned);

    try {
      await axios.post(
        "https://tank-war.mascom.vn/api/user/update-status",
        {
          code,
          banned,
        },
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.code === code ? { ...u, banned } : u))
      );
    } catch (error) {
      if (error.response.data.code === 403) {
        alert("You do not have permission to perform this action.");
        return;
      }
      console.error("Error updating user status:", error);
    }
  };

const MAX_VISIBLE_PAGES = 5;

// FILTER
const filteredUsers = username
  ? users.filter((u) =>
      u.username?.toLowerCase().includes(username.toLowerCase())
    )
  : users;

// PAGINATION (MUST USE filteredUsers)
const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentUsers = filteredUsers.slice(startIndex, endIndex);

const handlePreviousPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const goToPage = (pageNumber) => {
  setCurrentPage(pageNumber);
};

const getPageNumbers = () => {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

  if (end - start < MAX_VISIBLE_PAGES - 1) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );
};

  
  return (
    <div className="App">
      <div className="d-flex flex-column flex-md-row min-vh-100">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-3 p-md-4">
          <h2 className="h2 fw-bold mb-4">Users</h2>

          {/* SEARCH CARD */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-3 p-md-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label fw-medium">User name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Enter username"
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-3">
                  {/* <button
                    className="btn btn-primary w-100"
                    onClick={() => setCurrentPage(1)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* TABLE + CONTENT */}
          <div className="row">
            <div className="col-12">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* RESPONSIVE TABLE */}
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered table-sm mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold py-3">Username</th>
                          <th className="fw-bold py-3">Name</th>
                          <th className="fw-bold py-3">Gold</th>
                          <th className="fw-bold py-3">Diamond</th>
                          <th className="fw-bold py-3">Ticket</th>
                          <th className="fw-bold py-3">Play Ticket</th>
                          <th className="fw-bold py-3">Create Date</th>
                          <th className="fw-bold py-3">Status</th>
                          <th className="fw-bold py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.length > 0 ? (
                          currentUsers.map((user) => (
                            <tr key={user.username}>
                              <td className="py-3">{user.username}</td>
                              <td className="py-3">{user.name}</td>
                              {/* <td className="py-3">
                                {Array.isArray(user.roles)
                                  ? user.roles.join(", ")
                                  : user.roles}
                              </td> */}
                              <td className="py-3">{user.coin}</td>
                              <td className="py-3">{user.gem}</td>
                              <td className="py-3">{user.ticket}</td>
                              <td className="py-3">{user.playTicket}</td>
                              <td className="py-3">{user.created_at}</td>
                              <td className="py-3">
                                <span
                                  className={`badge ${
                                    user.banned ? "bg-danger" : "bg-success"
                                  }`}
                                >
                                  {user.banned ? "Inactive" : "Active"}
                                </span>
                              </td>
                              <td className="py-3">
                                <button
                                  className={`btn btn-sm ${
                                    user.banned ? "btn-success" : "btn-danger"
                                  }`}
                                  onClick={() =>
                                    updateUserStatus(user.code, !user.banned)
                                  }
                                >
                                  {user.banned ? "Activate" : "Deactivate"}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default ListUsers;
