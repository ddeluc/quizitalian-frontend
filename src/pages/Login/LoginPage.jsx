import React from 'react';
import Auth from '../../components/Auth/Auth';

function LoginPage({ setUserData, setToken, setWelcome }) {

  return (
    <div>
      <Auth setUserData={setUserData} setToken={setToken} setWelcome={setWelcome} />
    </div>
  );
}

export default LoginPage;
