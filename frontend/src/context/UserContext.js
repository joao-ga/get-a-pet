import { createContext } from "react";
import useAuth from "../hooks/userAuth";

const Context = createContext()

function UserProvider({children}) {

    const {authenticated, register} = useAuth()

    return(
        <Context.Provider value={{authenticated, register}}>
            {children}
        </Context.Provider>
    )

}

export {Context, UserProvider}