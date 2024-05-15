import { useEffect, useState } from "react";

import Alert from "@/components/alert";

const LogInPage = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(0);

  useEffect(() => {
    const message = localStorage.getItem('signupMessage');
    const status = localStorage.getItem('signupStatus');
    if(message !== undefined && status !== undefined) {
      setAlertMessage(message!);
      const statusToNumber = parseInt(status!);
      setAlertStatus(statusToNumber);
    }
  },[alertMessage, alertStatus])

  return(
    <div className="container-fluid container-lg container-md">
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-6 col-md-6">
        { alertMessage ? <Alert status= {alertStatus} message= {alertMessage}/> : null }
          <h2>Login now</h2>
        </div>
      </div>
    </div>
  )
}

export default LogInPage;