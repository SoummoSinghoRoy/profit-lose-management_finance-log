import { useState } from "react";
import { useDispatch } from "react-redux";

import { clearAuthStateAction } from "@/lib/action/auth.action";

function Alert(props) {
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch();

  const dismissAlert = () => {
    setShowAlert(false)
    const persistedData = sessionStorage.getItem('persist:root');
    if(persistedData) {
      sessionStorage.removeItem('persist:root')
    }
    dispatch(clearAuthStateAction());
  }
  return (
    showAlert && (
      <div
        className={`alert
        ${props.status === 200 ? "alert-success" : props.status === 500 ? "alert-danger" : "alert-warning"} 
        alert-dismissible`}
        role="alert"
      >
        <strong>{props.message}</strong>
        <button type="button" className="btn-close" onClick={dismissAlert}></button>
      </div>
    )
  )
}

export default Alert;