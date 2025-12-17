import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../utils/sessionManager";
import Header from "./header.jsx";
function ListUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const componentDidMount = async () => {
    axios
      .get("http://146.88.41.51:8998/user/users", {
        headers: {      
        Authorization: "Bearer " + getToken(),
        },
      })
      .then((response) => {
        const data = response.data;
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    componentDidMount();
  }, []);

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

  return (
    <div className="App">
      <div className="py-2 container">
        <Header />
        <div className="row">
          <div className="col-12">
            <h2 className="h2 fw-bold">Users</h2>
          </div>
          <div className="col-12">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>username</th>
                  <th>name</th>
                  <th>roles</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentUsers.map((user) => (
                    <tr className="cursor-pointer" key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.roles}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {/* Pagination Controls */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
