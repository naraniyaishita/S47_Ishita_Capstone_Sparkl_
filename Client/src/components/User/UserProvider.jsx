import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
 const [username, setUserName] = useState('');
 const [useremail, setUserEmail] = useState('');
 const [userId, setUserId] = useState('');

 useEffect(() => {
  const storedUsername = localStorage.getItem('username');
  const storedUserEmail = localStorage.getItem('useremail');
  const storedUserId = localStorage.getItem('userId');

  if (storedUsername) setUserName(storedUsername);
  if (storedUserEmail) setUserEmail(storedUserEmail);
  if (storedUserId) setUserId(storedUserId);
}, []);

useEffect(() => {
  localStorage.setItem('username', username);
  localStorage.setItem('useremail', useremail);
  localStorage.setItem('userId', userId);
}, [username, useremail, userId]);

 return (
    <UserContext.Provider value={{ username, setUserName, useremail, setUserEmail, userId, setUserId }}>
      {children}
    </UserContext.Provider>
 );
};

export default UserProvider;
