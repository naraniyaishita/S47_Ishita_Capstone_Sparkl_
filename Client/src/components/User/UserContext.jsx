import React from 'react'

const UserContext = React.createContext(
    {
        username : '',
        setUserName : () => {},
        useremail : '',
        setUserEmail : () => {},
        userId : '',
        setUserId : () => {}

    }
)

export default UserContext
