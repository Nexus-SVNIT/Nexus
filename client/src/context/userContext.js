import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        async function fetchUser() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-login`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setUser(data.decoded);
                // console.log(user);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                localStorage.removeItem("token");
            }
        }
        fetchUser();
    }, []);

    const logOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate(`/login?redirect_to=${encodeURIComponent(pathname)}`);
    }

    return (
        <UserContext.Provider value={{ user, setUser, logOut }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
}

export default UserContext;
