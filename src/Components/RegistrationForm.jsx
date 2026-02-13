import React, { useState } from "react";
import '../styles/RegistrationForm.css';
import AuthNavbar from './AuthNavbar';

const RegistrationForm = ({ onRegistrationComplete, onToggleLogin, onLogoClick }) => {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    // Common fields
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // User fields
    mobileNumber: "",
    city: "",
    // Worker fields
    age: "",
    gender: "",
    location: "",
    contactDetails: "",
    jobCategory: "",
    experience: "",
    availability: "",
    idProof: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "user") {
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
        newErrors.mobileNumber = "Invalid mobile number";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
    } else if (role === "worker") {
      if (!formData.age) {
        newErrors.age = "Age is required";
      } else if (formData.age < 18 || formData.age > 70) {
        newErrors.age = "Age must be between 18 and 70";
      }
      if (!formData.gender || formData.gender === "Gender") {
        newErrors.gender = "Please select gender";
      }
      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
      }
      if (!formData.contactDetails.trim()) {
        newErrors.contactDetails = "Contact details are required";
      }
      if (!formData.jobCategory.trim()) {
        newErrors.jobCategory = "Job category is required";
      }
      if (!formData.experience || formData.experience === "Experience") {
        newErrors.experience = "Please select experience level";
      }
      if (!formData.availability || formData.availability === "Availability") {
        newErrors.availability = "Please select availability";
      }
      if (!formData.idProof.trim()) {
        newErrors.idProof = "ID proof is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data in localStorage (in production, send to backend)
      const userData = {
        id: Date.now(),
        role,
        ...formData,
        registeredAt: new Date().toISOString()
      };

      // Save to currentUser for immediate login
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('userRole', role);

      // Save to registeredUsers array for future logins
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Call parent callback
      onRegistrationComplete(userData);

      // Show success message
      alert(`Welcome ${formData.fullName}! You have been registered as a ${role}.`);
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{cssStyles}</style>

      <AuthNavbar onLogoClick={onLogoClick} />

      <div className="auth-page-content">
        <div className="bigBox">
        <h2 className="title">Role Based Registration</h2>

        {/* Role Selection */}
        <div className="roleContainer">
          <div
            className={`roleButton ${role === "user" ? "active" : ""}`}
            onClick={() => {
              setRole("user");
              setErrors({});
            }}
          >
            👤 User
          </div>

          <div
            className={`roleButton ${role === "worker" ? "active" : ""}`}
            onClick={() => {
              setRole("worker");
              setErrors({});
            }}
          >
            👷 Worker
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* COMMON FIELDS */}
          <div className="formContainer">
            <input
              className="inputBox"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && <span className="errorMsg">{errors.fullName}</span>}

            <input
              className="inputBox"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="errorMsg">{errors.email}</span>}

            <input
              className="inputBox"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="errorMsg">{errors.password}</span>}

            <input
              className="inputBox"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <span className="errorMsg">{errors.confirmPassword}</span>}

            {/* USER FORM */}
            {role === "user" && (
              <>
                <input
                  className="inputBox"
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
                {errors.mobileNumber && <span className="errorMsg">{errors.mobileNumber}</span>}

                <input
                  className="inputBox"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && <span className="errorMsg">{errors.city}</span>}
              </>
            )}

            {/* WORKER FORM */}
            {role === "worker" && (
              <>
                <input
                  className="inputBox"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
                {errors.age && <span className="errorMsg">{errors.age}</span>}

                <select
                  className="inputBox"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Gender">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="errorMsg">{errors.gender}</span>}

                <input
                  className="inputBox"
                  type="text"
                  name="location"
                  placeholder="City / Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && <span className="errorMsg">{errors.location}</span>}

                <input
                  className="inputBox"
                  type="text"
                  name="contactDetails"
                  placeholder="Contact Details (Phone Number)"
                  value={formData.contactDetails}
                  onChange={handleInputChange}
                />
                {errors.contactDetails && <span className="errorMsg">{errors.contactDetails}</span>}

                <input
                  className="inputBox"
                  type="text"
                  name="jobCategory"
                  placeholder="Job Category (Ex. Electrician, Plumber, Carpenter)"
                  value={formData.jobCategory}
                  onChange={handleInputChange}
                />
                {errors.jobCategory && <span className="errorMsg">{errors.jobCategory}</span>}

                <select
                  className="inputBox"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <option value="Experience">Experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Some Experience">Some Experience</option>
                  <option value="Experienced">Experienced</option>
                </select>
                {errors.experience && <span className="errorMsg">{errors.experience}</span>}

                <select
                  className="inputBox"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="Availability">Availability</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Emergency">Emergency</option>
                </select>
                {errors.availability && <span className="errorMsg">{errors.availability}</span>}

                <input
                  className="inputBox"
                  type="text"
                  name="idProof"
                  placeholder="ID Proof (Aadhar Card Number or Any ID)"
                  value={formData.idProof}
                  onChange={handleInputChange}
                />
                {errors.idProof && <span className="errorMsg">{errors.idProof}</span>}
              </>
            )}

            <button className="submitBtn" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : `Register as ${role === "user" ? "User" : "Worker"}`}
            </button>

            <div className="toggleLogin">
              <p>Already have an account? <span onClick={onToggleLogin} className="loginLink">Login here</span></p>
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
.bigBox {
  width: 100%;
  max-width: 420px;
  padding: 30px;
  border-radius: 15px;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.bigBox::before {
  content: "";
  position: absolute;
  inset: -3px;
  background: linear-gradient(90deg, red, blue, cyan, lime, red);
  background-size: 400%;
  animation: led 6s linear infinite;
  z-index: -1;
  border-radius: 18px;
}

.title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  margin-top: 0;
}

.roleContainer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.roleButton {
  flex: 1;
  padding: 12px;
  text-align: center;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  background: #111;
  overflow: hidden;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.roleButton:hover {
  transform: translateY(-2px);
}

.roleButton.active {
  background: linear-gradient(90deg, red, blue, cyan, lime, red);
  background-size: 400%;
  animation: led 4s linear infinite;
}

.roleButton::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, red, blue, cyan, lime, red);
  background-size: 400%;
  animation: led 4s linear infinite;
  z-index: -1;
  border-radius: 10px;
  opacity: 0;
}

.roleButton.active::before {
  opacity: 1;
}

.formContainer {
  display: flex;
  flex-direction: column;
}

.inputBox {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  outline: none;
  background: #111;
  color: white;
  position: relative;
  background-image: linear-gradient(#111, #111),
    linear-gradient(90deg, red, blue, cyan, lime, red);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-size: 400%;
  animation: led 5s linear infinite;
  font-family: Arial;
  transition: all 0.3s ease;
}

.inputBox::placeholder {
  color: #aaa;
}

.inputBox:focus {
  background-image: linear-gradient(#1a1a1a, #1a1a1a),
    linear-gradient(90deg, cyan, lime, red, blue, cyan);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.inputBox::-webkit-outer-spin-button,
.inputBox::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.inputBox[type=number] {
  -moz-appearance: textfield;
}

.errorMsg {
  color: #ff6b6b;
  font-size: 12px;
  margin: -10px 0 10px 0;
  display: block;
}

.submitBtn {
  padding: 12px;
  background: #000;
  color: white;
  border: 2px solid cyan;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  transition: 0.3s;
  font-weight: 600;
  font-size: 14px;
}

.submitBtn:hover:not(:disabled) {
  background: cyan;
  color: black;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.submitBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggleLogin {
  text-align: center;
  margin-top: 15px;
  color: #aaa;
  font-size: 13px;
}

.toggleLogin p {
  margin: 0;
}

.loginLink {
  color: cyan;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.loginLink:hover {
  color: lime;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

@keyframes led {
  0% { background-position: 0% }
  100% { background-position: 400% }
}

@media (max-width: 480px) {
  .bigBox {
    padding: 20px;
    border-radius: 12px;
  }

  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .roleContainer {
    margin-bottom: 15px;
  }

  .inputBox {
    margin-bottom: 10px;
    padding: 8px;
  }

  .submitBtn {
    padding: 10px;
    margin-top: 10px;
  }
}
`;

export default RegistrationForm;
