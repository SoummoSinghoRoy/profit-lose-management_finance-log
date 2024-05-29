"use client"
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import Alert from "@/app/components/alert";
import { signupPostRequest } from "@/app/utility/auth.fetcher";

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}

function SignUp() {
  const [signupState, setSignupState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(0);
  const [error, setError] = useState({});
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
    try {
      const signupRequestBody = {...signupState, thumbnail: file}
      const response = await signupPostRequest(signupRequestBody);
      if (response.status !== 200) {
        setAlertMessage(response.message);
        setAlertStatus(response.status);
        setError(response.error);
      } else {
        setError({});
        setAlertMessage(response.message);
        setAlertStatus(response.status)
        setFile(null);
        setSignupState({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        localStorage.setItem('signupMessage', response.message);
        localStorage.setItem('signupStatus', response.status);
       router.push('/auth/login')
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('Internal server error');
      setAlertStatus(500)
    }
  }
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError({}); 
        setSignupState({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setFile(null)
      }, 15000); 
      return () => clearTimeout(timeoutId);
    }
  }, []);
  return (
    <div className="container-fluid container-lg container-md">
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-6 col-md-6">
          <div className="card bg-light-subtle border-light-subtle shadow-sm mx-lg-4 mx-md-4">
            <div className="card-body">
              {alertMessage ? <Alert status={alertStatus} message={alertMessage} /> : null}
              <div className="card-title border-bottom">
                <h4 className="text-center py-1 text-primary-emphasis">Signup Now</h4>
              </div>
              <form onSubmit={submitHandle} encType="multipart/form-data">
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-outline-success">signup</button>
                  <p>Already have an account? <Link href="/auth/login">login</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;