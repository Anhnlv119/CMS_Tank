import React from "react";
import { useNavigate } from "react-router-dom";
import md5 from "md5";
import { getToken } from "../utils/sessionManager";
import Sidebar from "./sidebar.jsx";
function CreateStaff() {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const hashedPassword = md5(password);

      const response = await fetch(
        "https://tank-war.mascom.vn/api/user/createStaffAcc",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            name,
            username,
            password: hashedPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Create staff failed");
      }

      const data = await response.json();
      console.log("Staff created:", data);

      setSuccess("Staff account created successfully!");
      setName("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="d-flex">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <div className="flex-grow-1 p-4">
          {" "}
          <div className="container pt-xl-5">
            <div className="row justify-content-center">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-3 p-md-4 p-xl-5">
                    <div className="mb-4">
                      <h3>Create Staff Account</h3>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      {success && (
                        <div className="alert alert-success">{success}</div>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleCreate}>
                        <div className="row gy-3">
                          <div className="col-12">
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Full Name"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                              />
                              <label htmlFor="name">Full Name</label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                              />
                              <label htmlFor="username">Username</label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-floating">
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <label htmlFor="password">Password</label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="d-grid">
                              <button
                                className="btn bsb-btn-2xl btn-primary"
                                type="submit"
                              >
                                Create Account
                              </button>
                            </div>
                          </div>

                          <div className="col-12 text-center">
                            <button
                              type="button"
                              className="btn btn-link"
                              onClick={() => navigate("/home")}
                            >
                              Back to Home
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStaff;
