import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../../firebase';

const usercontext = createContext()

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                setUser(userCredential); // User is logged in                
            } else {
                setUser(null); // No user logged in
                console.log('noUser');

            }
            // setLoading(false);
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    return (
        <usercontext.Provider value={{ user, setUser }}>
            {children}
        </usercontext.Provider>
    );
};

export function useUserAuth() {
    return useContext(usercontext);
}