import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const REGISTER_URL = "http://127.0.0.1:5000/user/signup"

function Register() {
  //const history = useHistory();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);

    if (formData.email && (!formData.email.includes('.') || !formData.email.includes('@'))) {
      setError('Email must contain both "." and "@".')
    }
  };

   const handleSubmit = (e) => {
     e.preventDefault();

  };

  const registerUser = async e => {

    e.preventDefault();
    
     if (formData.password_confirmation !== formData.password) {
       setError('Passwords do not match');
       return;
    }

    const userdata = {
      'role': userType,
      'first_name': formData.first_name,
      'last_name': formData.last_name,
      'middle_name': formData.middle_name, // added middle name
      'username': formData.username,
      'email': formData.email,
      'staff_number': formData.password,
      'reg_number': formData.reg_number,
      'password_hash': formData.password,
      'password_confirmation': formData.password_confirmation
    }

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(userdata)
    })
    if (response.ok){
      const data = await response.json()
      
      setFormData({});
      setRegistrationSuccess(true);
      history.push('/Login');
      
     

    }else{
      console.log("There was an error")
    }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const studentFormFields = (
    <>
      <label htmlFor="first_name">First Name:</label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        value={formData.first_name || ''}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="Middle_name">Middle Name:</label>
      <input
        type="text"
        id="middle_name"
        name="middle_name"
        value={formData.middle_name || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="last_name">Last Name:</label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        value={formData.last_name || ''}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="reg_number">Registration Number:</label>
      <input
        className='reg-stuff'
        type="reg_number"
        id="reg_number"
        name="reg_number"
        value={formData.reg_number || ''}
        onChange={handleChange}
      />

      <br />

      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="password">Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
      />
       <button onClick={togglePassword}>see</button>
      <br />

      <label htmlFor="password_confirmation">Confirm Password:</label>
      <input
        className='confirm'
        type="password"
        id="password_confirmation"
        name="password_confirmation"
        value={formData.password_confirmation || ''}
        onChange={handleChange}
      />
      <br />
      
      
    </>
  );

  const instructorFormFields = (
    <>
      <label htmlFor="first_name">First Name:</label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        value={formData.first_name || ''}
        onChange={handleChange}
      />
      
      <label htmlFor="Middle_name">Middle Name:</label>
      <input
        type="text"
        id="middle_name"
        name="middle_name"
        value={formData.middle_name || ''}
        onChange={handleChange}
      />
      <br />
      <br />
      <label htmlFor="last_name">Last Name:</label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        value={formData.last_name || ''}
        onChange={handleChange}
      />
      
      <br />
      <label htmlFor="staff_number">Staff Number:</label>
      <input
        type="text"
        id="staff_number"
        name="staff_number"
        value={formData.staff_number || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="password_confirmation">Confirm Password:</label>
      <input
        
        type={showPassword ? "text" : "password"}
        id="password_confirmation"
        name="password_confirmation"
        value={formData.password_confirmation || ''}
        onChange={handleChange}
      />
       <br />
      
      
    </>
  );

  return (
    <div>
      <h2>Register Here</h2>
      <div>
        <label htmlFor="userType">Select User Type:</label>
        <select id="userType" value={userType} onChange={handleUserTypeChange}>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>
      <form onSubmit={registerUser} >
        {userType === 'student' && studentFormFields}
        {userType === 'instructor' && instructorFormFields}
        <br />
        <button type="submit">Register</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {registrationSuccess && <div className="success-message">Successful Registration!</div>}
    </div>
  );
}

export default Register;


