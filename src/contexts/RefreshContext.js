import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshFlag, setRefreshFlag] = useState(0);

    // This function triggers a refresh by updating the flag.
    const triggerRefresh = useCallback(() => {
        setRefreshFlag((prev) => prev + 1);
    }, []);

    // Optionally, expose the refresh flag for debugging.
    return (
        <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
