"use client"
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import Alert from "@/app/components/alert";
import { signupAction } from "@/lib/action/auth.action";
import UnProtectedRoute from "@/app/components/route-protection/UnProtectedRoute";

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}

function SignUp() {
  const [signupState, setSignupState] = useState(initialState);
  const [file, setFile] = useState(null);
  const { error, alertMessage, alertStatus } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setSignupState({ ...signupState, [name]: value });
  }

  const fileUploadHanlder = (event) => {
    setFile(event.target.files[0])
  }

  const submitHandle = async (event) => {
    event.preventDefault()
    const signupRequestBody = { ...signupState, thumbnail: file };
    dispatch(signupAction(signupRequestBody));
    setSignupState(initialState);
    document.getElementById('thumbnail').value = '';
  }
  useEffect(() => {
    if (alertStatus === 200) {
      router.push('/auth/login')
    }
  }, [alertStatus, router]);

  return (
    <UnProtectedRoute>
      <Head>
        <title>Signup</title>
      </Head>
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-6 col-md-6">
          <div className="card bg-light-subtle border-light-subtle shadow-sm mx-lg-5 mx-md-5 pb-lg-3">
            <div className="card-body">
              {alertMessage ? <Alert status={alertStatus} message={alertMessage} /> : null}
              <div className="card-title border-bottom">
                <h4 className="text-center py-1 text-primary-emphasis">Signup Now</h4>
              </div>
              <form onSubmit={submitHandle} encType="multipart/form-data">
                <div className="row g-3 mb-3">
                  <div className="col-12 col-lg-6 col-md-6">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={signupState.username}
                      className="form-control form-control-sm"
                      placeholder="exmple: john"
                      onChange={changeHandler}
                    />
                    <div className="invalid-feedback d-block">
                      {error.message?.username && <p>{error.message.username}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={signupState.email}
                      className="form-control form-control-sm"
                      placeholder="exmple: john@mail.com"
                      onChange={changeHandler}
                    />
                    <div className="invalid-feedback d-block">
                      {error.message?.email && error.message.email}
                    </div>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-lg-6 col-md-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={signupState.password}
                      className="form-control form-control-sm"
                      onChange={changeHandler}
                      placeholder="Password length must be 6 to 10 charecter"
                    />
                    <div className="invalid-feedback d-block">
                      {error.message?.password && error.message.password}
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={signupState.confirmPassword}
                      className="form-control form-control-sm"
                      onChange={changeHandler}
                    />
                    <div className="invalid-feedback d-block">
                      {error.message?.confirmPassword && error.message.confirmPassword}
                    </div>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="thumbnail" className="form-label">Choose Thumbnail</label>
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      className="form-control form-control-sm"
                      onChange={fileUploadHanlder}
                    />
                    <div className="invalid-feedback d-block">
                      {error.message?.thumbnail && error.message.thumbnail}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-outline-success">signup</button>
                </div>
              </form>
              <p className="mb-0">Already have an account? <Link href="/auth/login">login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </UnProtectedRoute>
  )
}

export default SignUp;