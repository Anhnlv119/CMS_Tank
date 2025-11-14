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
       });
 
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Login failed');
       }
 
       const data = await response.json();
       
       // Store token and expiration timestamp (1 hour = 3600000 ms)
       const expirationTime = Date.now() + 3600000;
       localStorage.setItem('authToken', data.access_token);
       localStorage.setItem('tokenExpiration', expirationTime);
       
       console.log('Login successful:', data);
       setIsLoading(false);
       
       // Set timeout to clear token after 1 hour
       setTimeout(() => {
         localStorage.removeItem('authToken');
         localStorage.removeItem('tokenExpiration');
         console.log('Token expired and cleared');
         navigate('/login');
       }, 3600000);
       
       navigate('/home');
       
     } catch (err) {
       setError(err.message);
       setIsLoading(false);
       console.log(username + "/n" + password + "/n" + err.message);
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