import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../utils/sessionManager";
import Sidebar from "./sidebar.jsx";

function StatsDays() {
    const today = new Date().toISOString().split("T")[0];
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

const fetchUsers = async () => {
  try {
    setIsLoading(true);

    let url = "http://146.88.41.51:8998/dashboard/stats";

    if (startDate && endDate && startDate !== endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url += "?days=7";
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });

    setUsers(response.data || {});
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);
 

  return (
    <div className="App">
      <div className="d-flex">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-4">
          <h2 className="h2 fw-bold mb-4">Stats</h2>

          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-auto">
                    <label className="form-label fw-medium mb-2">From date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                      style={{ width: "150px" }}
                    />
                  </div>
                  <div className="col-auto">
                    <label className="form-label fw-medium mb-2">To date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control"
                      style={{ width: "150px" }}
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

          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Unique Users</th>
                    <th>Total Logins</th>
                  </tr>
                </thead>
                <tbody>
                      <tr>
                        <td>{users.unique_users}</td>
                        <td>{users.total_logins}</td>
                      </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsDays;
