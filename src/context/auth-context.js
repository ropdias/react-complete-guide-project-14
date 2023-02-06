import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuth: false,
  login: () => {
    alert("Please configure AuthContext using the Provider !"); // Just a safety mechanism to make sure we use the Provider first
  },
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  const context = { login: loginHandler, isAuth: isAuthenticated };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
