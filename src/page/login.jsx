import React from 'react';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';


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

    const response = await fetch('http://146.88.41.51:8998/auth/loginStaff', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        password: hashedPassword 
      }),
      credentials: 'include' // Important for cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in cookie (1 hour expiration)
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 1000)); // 1 hour
    document.cookie = `authToken=${data.access_token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
    document.cookie = `tokenExpiration=${expirationDate.getTime()}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
    
    // Store in sessionStorage as backup
    sessionStorage.setItem('authToken', data.access_token);
    sessionStorage.setItem('tokenExpiration', expirationDate.getTime());
    
    console.log('Login successful:', data);
    setIsLoading(false);
    
    // Set timeout to logout and redirect after 1 hour
    setTimeout(() => {
      handleLogout();
    }, 3600000); // 1 hour
    
    navigate('/home');
    
  } catch (err) {
    setError(err.message);
    setIsLoading(false);
    console.log(username + "\n" + password + "\n" + err.message);
  }
};

// Logout function - clears session and cookies then redirects to login
const handleLogout = () => {
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies
  deleteCookie('authToken');
  deleteCookie('tokenExpiration');
  
  console.log('Session expired - redirecting to login');
  
  // Redirect to login page
  navigate('/login');
};

// Helper function to delete cookies
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Check if session is valid (call this on protected pages)
const checkSession = () => {
  const token = getCookie('authToken');
  const expiration = getCookie('tokenExpiration');
  
  if (!token || !expiration) {
    navigate('/login');
    return false;
  }
  
  if (Date.now() > parseInt(expiration)) {
    handleLogout();
    return false;
  }
  
  return true;
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
                  <h3>Log in</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                </div>
              </div>
            </div>
             {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ): (<form onSubmit={handleLogin}>
              <div className="row gy-3 overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input type="username" className="form-control" name="username" id="username" placeholder="Username" value={username} required onChange={(e) => setUsername(e.target.value)}/>
                    <label htmlFor="username" className="form-label">User</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" name="password" id="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="password" className="form-label">Password</label>
                  </div>
                </div>
               
                <div className="col-12">
                  <div className="d-grid">
                    <button className="btn bsb-btn-2xl btn-primary" type="submit" onClick={handleLogin}>Log in now</button>
                  </div>
                </div>
              </div>
            </form>)  }
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

export default Login;