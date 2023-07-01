import { useState, useEffect } from "react";
import axios from "axios";
const { createContext } = require("react");


export const UserContext = createContext({});
export function UserContextProvider({children}) {
    // useEffect(() => {
    //     if (!user) {
    //         axios.get('/profile')
    //     }
    // }, [])
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={ {user,setUser} }>
        {children}
        </UserContext.Provider>
    )
}