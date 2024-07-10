import { createContext } from "react";
import useAuth from "../hooks/userAuth";

const Context = createContext()

function UserProvider({children}) {

    const {authenticated, register, logout, login} = useAuth()

    return(
        <Context.Provider value={{authenticated, register, logout, login}}>
            {children}
        </Context.Provider>
    )

}

export {Context, UserProvider}