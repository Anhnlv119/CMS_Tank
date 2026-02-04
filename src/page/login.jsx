import React from 'react';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';
import { storeAuth, setupSessionTimeout } from '../utils/sessionManager';

function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const hashedPassword = md5(password);
      console.log("Request body:", JSON.stringify({ username, password: hashedPassword }));

      const response = await fetch('https://tank-war.mascom.vn/api/auth/loginStaff', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password: hashedPassword 
        }),
        
        // credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store authentication data using session manager
      storeAuth(data.access_token, data.roles);
      
      console.log('Login successful:', data);
      setIsLoading(false);
      
      // Set timeout to logout after 1 hour
      setupSessionTimeout(() => {
        navigate('/login');
      });
      
      navigate('/home');
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.log(username + "\n" + password + "\n" + err.message);
    }
  };

  return (
    <section className="bg-info p-3 p-md-4 p-xl-5 vh-100">
      <div className="container pt-xl-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h3>Tanks War Login</h3>
                      {error && <div className="alert alert-danger">{error}</div>}
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLogin}>
                    <div className="row gy-3 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input 
                            type="text" 
                            className="form-control" 
                            name="username" 
                            id="username" 
                            placeholder="Username" 
                            value={username} 
                            required 
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <label htmlFor="username" className="form-label">User</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            value={password} 
                            required 
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label htmlFor="password" className="form-label">Password</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <button className="btn bsb-btn-2xl btn-primary" type="submit">
                            Log in now
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;