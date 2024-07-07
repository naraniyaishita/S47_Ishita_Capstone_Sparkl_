import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../User/UserContext';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { setUserName, setUserEmail, setUserId } = useContext(UserContext);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const username = urlParams.get('username');
    const email = urlParams.get('email');


    if (token) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('useremail', email);

      setUserName(username);
      setUserEmail(email);
      setUserId(userId);
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate, setUserName, setUserEmail, setUserId]);

  return null;
};

export default GoogleSuccess;
