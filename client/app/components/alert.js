import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthStateAction } from "@/lib/action/auth.action";
import { clearTransactionStateAction } from "@/lib/action/transaction.action";

function Alert(props) {
  const [showAlert, setShowAlert] = useState(true);
  const authState = useSelector((state) => state.auth);
  const transactionState = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  const dismissAlert = () => {
    setShowAlert(false)
    if(authState.needsClearState) {
      dispatch(clearAuthStateAction());
    }
    if(transactionState.needsClearState) {
      dispatch(clearTransactionStateAction());
    }
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