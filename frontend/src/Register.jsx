import React, { useState } from 'react';
import './Register.css'; // Import the CSS file

const REGISTER_URL = "http://127.0.0.1:5000/user/signup";

function Register() {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const registerUser = async e => {
    e.preventDefault();

    const userdata = {
      'role': userType,
      'first_name': formData.first_name,
      'last_name': formData.last_name,
      'middle_name': formData.middle_name,
      'username': formData.username,
      'email': formData.email,
      'staff_number': formData.password,
      'reg_number': formData.reg_number,
      'password_hash': formData.password,
      'password_confirmation': formData.password_confirmation
    };

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(userdata)
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log("There was an error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const studentFormFields = (
    <div className='signupform'>
      <>
      <div className='inputsignup'>
      <label htmlFor="first_name" className="label">First Name:</label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        value={formData.first_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      <div className='inputsignup'>
      <label htmlFor="middle_name" className="label">Middle Name:</label>
      <input
        type="text"
        id="middle_name"
        name="middle_name"
        value={formData.middle_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
     
      <div className='inputsignup'>
      <label htmlFor="last_name" className="label">Last Name:</label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        value={formData.last_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      
      <div className='inputsignup'>
      <label htmlFor="reg_number" className="label">Reg Number:</label>
      <input
        type="text"
        id="reg_number"
        name="reg_number"
        value={formData.reg_number || ''}
        onChange={handleChange}
        className="input reg-stuff"
      />
      </div>
      
      <div className='inputsignup'>
        <label htmlFor="username" className="label">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      
      <div className='inputsignup'>
      <label htmlFor="email" className="label">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
        className="input"
      />
      </div>

      <div className='inputsignup'>
      <label htmlFor="password" className="label">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
        className="input"
      />
      </div>

      <div className='inputsignup'>
      <label htmlFor="password_confirmation" className="label">Confirm Password:</label>
      <input
        type="password"
        id="password_confirmation"
        name="password_confirmation"
        value={formData.password_confirmation || ''}
        onChange={handleChange}
        className="input confirm"
      />
      </div>
      </>
    </div>
  );

  const instructorFormFields = (
    <div className='signupform'>
         <>
      <div className='inputsignup'>   
      <label htmlFor="first_name" className="label">First Name:</label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        value={formData.first_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>

      <div className='inputsignup'>
      <label htmlFor="middle_name" className="label">Middle Name:</label>
      <input
        type="text"
        id="middle_name"
        name="middle_name"
        value={formData.middle_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      <div className='inputsignup'>
      <label htmlFor="last_name" className="label">Last Name:</label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        value={formData.last_name || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      <div className='inputsignup'>
      <label htmlFor="staff_number" className="label">Staff Number:</label>
      <input
        type="text"
        id="staff_number"
        name="staff_number"
        value={formData.staff_number || ''}
        onChange={handleChange}
        className="input"
      />
      </div>

      <div className='inputsignup'>
      <label htmlFor="username" className="label">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      
      <div className='inputsignup'>
      <label htmlFor="email" className="label">Email:</label> 
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
        className="input"
      />
      </div>

      <div className='inputsignup'>
      <label htmlFor="password" className="label">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
        className="input"
      />
      </div>
      <div className='inputsignup'>
      <label htmlFor="password_confirmation" className="label">Confirm Password:</label>
      <input
        type="password"
        id="password_confirmation"
        name="password_confirmation"
        value={formData.password_confirmation || ''}
        onChange={handleChange}
        className="input confirm"
      />
      </div>
    </>

    </div>
 
  );

  return (
      <div className="register-container">
        <form className="register-form" onSubmit={registerUser}>
          <h2>Register Here</h2>
          <div>
            <label htmlFor="userType">Select User Type:</label>
            <select
              id="userType"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="">Select User Type</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {userType === 'student' && studentFormFields}
          {userType === 'instructor' && instructorFormFields}
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
  
  export default Register;