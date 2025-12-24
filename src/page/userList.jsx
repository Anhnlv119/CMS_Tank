import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../utils/sessionManager";
import Header from "./header.jsx";

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [username, setUsername] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://146.88.41.51:8998/user/users", {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });

      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination
  // const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
  // const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredUsers = username
    ? users.filter((u) =>
        u.username?.toLowerCase().includes(username.toLowerCase())
      )
    : users;


  const updateUserStatus = async (code, banned) => {
        console.log(code+ "----" + banned);

  try {
    await axios.post(
      "http://146.88.41.51:8998/user/update-status",
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
      prev.map((u) =>
        u.code === code ? { ...u, banned } : u
      )
    );
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="App">
      <div className="py-2 container-fluid">
        <Header />

        <div className="row">
          <div className="col-12">
            <h2 className="h2 fw-bold">Users</h2>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label fw-medium">User name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={fetchUsers}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 p-5">
            <table className="table table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Roles</th>
                  <th>Create Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>
                        {Array.isArray(user.roles)
                          ? user.roles.join(", ")
                          : user.roles}
                      </td>
                      <td>{user.createby}</td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`badge ${
                            user.banned ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {user.banned ? "Inactive" : "Active"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td>
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
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Page {currentPage} of {totalPages} • Showing{" "}
                {currentUsers.length} of {filteredUsers.length} users
              </span>

              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
