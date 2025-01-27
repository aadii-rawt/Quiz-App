import { createContext, useContext, useState } from "react";

const usercontext = createContext()

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <usercontext.Provider value={{ user, setUser }}>
            {children}
        </usercontext.Provider>
    );
};

export function useUserAuth() {
    return useContext(usercontext);
}