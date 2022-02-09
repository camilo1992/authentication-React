import React, { useCallback, useEffect, useState } from "react";
let logOutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  logIn: (token) => {},
  logOut: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExirationTime = new Date(expirationTime);
  const remainingDuration = adjExirationTime - currentTime;
  return remainingDuration;
};

const retrieveRemainingTime = () => {
  const storedToken = localStorage.getItem("token");
  const storedTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  let initialToken;
  const tokenData = retrieveRemainingTime();

  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
  }, []);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);
    logOutTimer = setTimeout(logOutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logOutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    logIn: logInHandler,
    logOut: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
