import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
 const [username, setUserName] = useState('');
 const [useremail, setUserEmail] = useState('');
 const [userId, setUserId] = useState('');

 useEffect(() => {
  const storedUsername = sessionStorage.getItem('username');
  const storedUserEmail = sessionStorage.getItem('useremail');
  const storedUserId = sessionStorage.getItem('userId');

  if (storedUsername) setUserName(storedUsername);
  if (storedUserEmail) setUserEmail(storedUserEmail);
  if (storedUserId) setUserId(storedUserId);
}, []);

useEffect(() => {
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('useremail', useremail);
  sessionStorage.setItem('userId', userId);
}, [username, useremail, userId]);

 return (
    <UserContext.Provider value={{ username, setUserName, useremail, setUserEmail, userId, setUserId }}>
      {children}
    </UserContext.Provider>
 );
};

export default UserProvider;
