import { useState } from "react";

function Alert(props) {
  const [showAlert, setShowAlert] = useState(true);

  const dismissAlert = () => {
    setShowAlert(false)
    localStorage.removeItem('signupMessage');
    localStorage.removeItem('signupStatus');
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