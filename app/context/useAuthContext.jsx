import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";

const usercontext = createContext()

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null)

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

    const fetchUser = async () => {
        const userDocRef = doc(db, `users/${user?.uid}`);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data();
        setUserData(userData);
    }

    useEffect(() => {
        fetchUser();
    }, [user])

    return (
        <usercontext.Provider value={{ user, setUser,userData }}>
            {children}
        </usercontext.Provider>
    );
};

export function useUserAuth() {
    return useContext(usercontext);
}