import { useState, createContext, type ReactNode, useContext } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType{
 user:boolean,
 setUser:React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType>({
  user:false,
  setUser:()=>{}
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);