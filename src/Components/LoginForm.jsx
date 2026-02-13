import React, { useState } from "react";
import '../styles/LoginForm.css';
import AuthNavbar from './AuthNavbar';

const LoginForm = ({ onLoginComplete, onToggleRegister, onLogoClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Trim email and password for comparison
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // For demo: check if user exists in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = storedUsers.find(u => 
        u.email.toLowerCase().trim() === trimmedEmail && 
        (u.password && u.password.trim()) === trimmedPassword
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        onLoginComplete(user);
      } else {
        // Demo credentials for testing
        if (trimmedEmail === "user@demo.com" && trimmedPassword === "password123") {
          const demoUser = {
            id: 1,
            role: "user",
            email: "user@demo.com",
            fullName: "John User",
            mobileNumber: "9876543210",
            city: "Delhi"
          };
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('userRole', 'user');
          onLoginComplete(demoUser);
        } else if (trimmedEmail === "worker@demo.com" && trimmedPassword === "password123") {
          const demoWorker = {
            id: 2,
            role: "worker",
            email: "worker@demo.com",
            fullName: "Raj Worker",
            jobCategory: "Electrician",
            experience: "Experienced",
            location: "Delhi"
          };
          localStorage.setItem('currentUser', JSON.stringify(demoWorker));
          localStorage.setItem('userRole', 'worker');
          onLoginComplete(demoWorker);
        } else {
          setError("Invalid email or password");
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{cssStyles}</style>
      
      <AuthNavbar onLogoClick={onLogoClick} />

      <div className="auth-page-content">
        <div className="loginBox">
        <h2 className="loginTitle">Login to HelperXpress</h2>

        <form onSubmit={handleLogin}>
          <div className="formContainer">
            <input
              className="inputBox"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            <input
              className="inputBox"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            {error && <span className="errorMsg">{error}</span>}

            <button className="submitBtn" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="toggleRegister">
              <p>Don't have an account? <span onClick={onToggleRegister} className="registerLink">Register here</span></p>
            </div>


          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    padding: "20px"
  }
};

const cssStyles = `
.loginBox {
  width: 100%;
  max-width: 380px;
  padding: 30px;
  border-radius: 15px;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.loginBox::before {
  content: "";
  position: absolute;
  inset: -3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  background-size: 400%;
  animation: ledGradient 6s linear infinite;
  z-index: -1;
  border-radius: 18px;
}

.loginTitle {
  color: white;
  text-align: center;
  margin: 0 0 25px 0;
  font-size: 24px;
}

.formContainer {
  display: flex;
  flex-direction: column;
}

.inputBox {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  outline: none;
  background: #111;
  color: white;
  position: relative;
  background-image: linear-gradient(#111, #111),
    linear-gradient(90deg, #667eea, #764ba2, #667eea);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-size: 400%;
  animation: ledGradient 5s linear infinite;
  font-family: Arial;
  font-size: 14px;
  transition: all 0.3s ease;
}

.inputBox::placeholder {
  color: #aaa;
}

.inputBox:focus {
  background-image: linear-gradient(#1a1a1a, #1a1a1a),
    linear-gradient(90deg, #667eea, #764ba2, #667eea);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.4);
}

.errorMsg {
  color: #ff6b6b;
  font-size: 12px;
  margin: -10px 0 10px 0;
  display: block;
  text-align: center;
}

.submitBtn {
  padding: 12px;
  background: #000;
  color: white;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 14px;
}

.submitBtn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.submitBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggleRegister {
  text-align: center;
  margin-top: 20px;
  color: #aaa;
  font-size: 13px;
}

.toggleRegister p {
  margin: 0;
}

.registerLink {
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.registerLink:hover {
  color: #764ba2;
  text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.demoCredentials {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.demoTitle {
  margin: 0 0 10px 0;
  color: #667eea;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.demoCred {
  color: #aaa;
  font-size: 11px;
  margin: 5px 0;
  font-family: monospace;
}

.demoCred strong {
  color: #667eea;
}

@keyframes ledGradient {
  0% { background-position: 0% }
  100% { background-position: 400% }
}

@media (max-width: 480px) {
  .loginBox {
    padding: 20px;
    border-radius: 12px;
  }

  .loginTitle {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .inputBox {
    margin-bottom: 12px;
    padding: 10px;
  }

  .submitBtn {
    padding: 10px;
    margin-top: 8px;
  }

  .demoCredentials {
    padding: 10px;
    margin-top: 15px;
  }

  .demoCred {
    font-size: 10px;
  }
}
`;

export default LoginForm;
