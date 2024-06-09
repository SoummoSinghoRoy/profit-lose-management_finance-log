"use client"
import Head from "next/head";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from "@/app/components/route-protection/ProtectedRoute";
import Alert from "@/app/components/alert";
import { changeUserPasswordAction } from "@/lib/action/auth.action";

const initialState = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
}

function ChangePassword() {
  const [changePasswordState, setChangePasswordState] = useState(initialState);
  const { error, alertMessage, alertStatus } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const changeHandler = (event) => {
    setChangePasswordState({...changePasswordState, [event.target.name]: event.target.value});
  }

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(changeUserPasswordAction(changePasswordState));
    setChangePasswordState(initialState)
  }
  return (
    <ProtectedRoute>
      <Head>
        <title>Change password</title>
      </Head>
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-4 col-md-4">
          <div className="card bg-light-subtle border-light-subtle shadow-sm mt-lg-5 mt-md-5 mx-lg-1 mx-md-1">
            <div className="card-body">
              {alertMessage ? <Alert status={alertStatus} message={alertMessage} /> : null}
              <div className="card-title border-bottom">
                <h4 className="text-center py-2 text-primary-emphasis">Change your password</h4>
              </div>
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={changePasswordState.currentPassword}
                    className="form-control form-control-sm"
                    onChange={changeHandler}
                  />
                  <div className="invalid-feedback d-block">
                    {error.message?.currentPassword && error.message.currentPassword}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-control form-control-sm"
                    value={changePasswordState.newPassword}
                    placeholder="Password length must be 6 to 10 charecter"
                    onChange={changeHandler}
                  />
                  <div className="invalid-feedback d-block">
                    {error.message?.newPassword && error.message.newPassword}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm new password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={changePasswordState.confirmNewPassword}
                    className="form-control form-control-sm"
                    onChange={changeHandler}
                  />
                  <div className="invalid-feedback d-block">
                    {error.message?.confirmNewPassword && error.message.confirmNewPassword}
                  </div>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-outline-success">Update now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ChangePassword;