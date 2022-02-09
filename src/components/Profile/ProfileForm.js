import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const changePaasswordInput = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const changePasswordHandler = (e) => {
    e.preventDefault();
    const enteredNewPassword = changePaasswordInput.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDPCFYMmmmAaxq2y7HyrWFCAjq8sw0UF2I",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          retrunSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      history.replace("/");
    });
  };
  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={changePaasswordInput} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
