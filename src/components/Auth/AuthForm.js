import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsSending(true);
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPCFYMmmmAaxq2y7HyrWFCAjq8sw0UF2I";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPCFYMmmmAaxq2y7HyrWFCAjq8sw0UF2I";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setIsSending(false);
        if (res.ok) {
          // ...........
          return res.json();
        } else {
          return res.json().then((data) => {
            let message = "Authentication failed !";
            // if (data && data.error && data.error.message) {
            //   message = data.error.message;
            // }
            throw new Error(message);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.logIn(data.idToken, expirationTime.toISOString());
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isSending ? (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          ) : (
            "Sending Request ..."
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
