import { createContext, useEffect, useState } from "react";

const UserContext = createContext();
const token = localStorage.getItem("token");

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-login`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ token })
                });
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                localStorage.removeItem("token");
            }
        }

        if (token) {
            fetchUser();
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
