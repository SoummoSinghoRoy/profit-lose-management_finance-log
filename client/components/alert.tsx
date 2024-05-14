import { useState } from "react";

const Alert = (props: any) => {
  const [showAlert, setShowAlert] = useState(true);

  const dismissAlert = (): void => {
    setShowAlert(false)
  }
  return(
    showAlert && (
      <div className="alert alert-warning alert-dismissible" role="alert">
      <strong>{ props.message }</strong>
      <button type="button" className="btn-close" onClick={dismissAlert}></button>
    </div>
    )
  )
}

export default Alert;