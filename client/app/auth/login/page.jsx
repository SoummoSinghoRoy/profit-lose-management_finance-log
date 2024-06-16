"use client"
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import Alert from "@/app/components/alert";
import { loginAction } from "@/lib/action/auth.action";
import UnProtectedRoute from "@/app/components/route-protection/UnProtectedRoute";

const initialState = {
  email: '',
  password: ''
}

function Login() {
  const [loginState, setLogInState] = useState(initialState);
  const { error, alertMessage, alertStatus, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const changeHandler = (event) => {
    setLogInState({ ...loginState, [event.target.name]: event.target.value });
  }

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(loginAction(loginState));
    setLogInState(initialState);
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <UnProtectedRoute>
      <Head>
        <title>Login</title>
      </Head>
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-4 col-md-4">
          <div className="card bg-light-subtle border-light-subtle shadow-sm mx-lg-2 mx-md-2">
            <div className="card-body">
              {alertMessage ? <Alert status={alertStatus} message={alertMessage} /> : null}
              <div className="card-title border-bottom">
                <h4 className="text-center py-1 text-primary-emphasis">Login Now</h4>
              </div>
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={loginState.email}
                    className="form-control form-control-sm"
                    onChange={changeHandler}
                    autoComplete="true"
                  />
                  <div className="invalid-feedback d-block">
                    {error.message?.email && error.message.email}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginState.password}
                    className="form-control form-control-sm"
                    onChange={changeHandler}
                    autoComplete="true"
                  />
                  <div className="invalid-feedback d-block">
                    {error.message?.password && error.message.password}
                  </div>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-outline-success">Login</button>
                </div>
              </form>
              <p className="mb-0">Don't have an account? <Link href="/auth/signup">signup</Link></p>
            </div>
          </div>
        </div>
      </div>
    </UnProtectedRoute>
  )
}

export default Login;