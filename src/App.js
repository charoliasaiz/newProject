
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import awsmobile from './aws-exports';
import Database from './Database';

// Set AWS region and initialize Cognito identity credentials
const AWS = require('aws-sdk');
AWS.config.region = awsmobile.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:a8a2989c-ef7e-453b-95e5-9cb439c7db7d', // Replace with your actual Identity Pool ID
});

// Configure the Cognito user pool
const poolData = {
  UserPoolId: awsmobile.userPoolId,
  ClientId: awsmobile.userPoolWebClientId,
};
const userPool = new CognitoUserPool(poolData);

function App() {
  // State to hold user credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const navigate = useNavigate();

  // Handle user login
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {

        localStorage.setItem('authToken', session.getIdToken().getJwtToken());

        // Set the login status to true
        setIsLoggedIn(true);

        // If successful, redirect the user to the database page (or any other authenticated page)
        navigate('/Database');
      },
      onFailure: (error) => {
        setError(error.message);
      },
    });
  };

  return (
      <div>
        <Routes>
        {!isLoggedIn && <Route path="/*" element={<LoginPage handleLogin={handleLogin} error={error} setEmail={setEmail} setPassword={setPassword} />} />}
        {isLoggedIn && <Route path="/Database" element={<Database />} />}
        </Routes>
      </div>
  );
}

// Separate LoginPage component
const LoginPage = ({ handleLogin, error, setEmail, setPassword }) => {
  return (
    <div>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default App;