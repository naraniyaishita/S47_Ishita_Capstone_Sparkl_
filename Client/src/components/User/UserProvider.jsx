import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
 const [username, setUserName] = useState(() => sessionStorage.getItem('username') || '');
 const [useremail, setUserEmail] = useState(() => sessionStorage.getItem('useremail') || '');
 const [userId, setUserId] = useState(() => sessionStorage.getItem('userId') || '');
 const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');

useEffect(() => {
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('useremail', useremail);
  sessionStorage.setItem('userId', userId);
  if (token) {
    sessionStorage.setItem('token', token);
  } else {
    sessionStorage.removeItem('token');
  }
}, [username, useremail, userId, token]);

 return (
    <UserContext.Provider value={{
      username,
      setUserName,
      useremail,
      setUserEmail,
      userId,
      setUserId,
      token,
      setToken,
      isAuthenticated: Boolean(token),
    }}>
      {children}
    </UserContext.Provider>
 );
};

export default UserProvider;
