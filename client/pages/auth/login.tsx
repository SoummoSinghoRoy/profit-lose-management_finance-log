import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

import Alert from "@/components/alert";
import { IError } from "./signup";
import { loginPostRequest } from "@/utility/fetcher";

const initialState = {
  email: '',
  password: ''
}

const LogInPage = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(0);
  const [loginState, setLogInState] = useState(initialState);
  const [error, setError] = useState<IError>({});
  const router = useRouter();

  const changeHandler = (event: any) => {    
    setLogInState({...loginState, [event.target.name]: event.target.value})
  }

  const submitHandler = async (event: any) => {
    event.preventDefault()
    try {
      const response = await loginPostRequest(loginState);
      console.log(response);
      if(response.status !== 200) {
        setAlertMessage(response.message);
        setAlertStatus(response.status);
        const apiError: IError = {
          message: {
            username: response.error?.message?.username || '',
            email: response.error?.message?.email || '',
            password: response.error?.message?.password || '',
            confirmPassword: response.error?.message?.confirmPassword || '',
            thumbnail: response.error?.message?.thumbnail || '',
          },
        };
        setError(apiError);
      } else {
        setError({});
        setLogInState({
          email: '',
          password: ''
        });
        localStorage.setItem('authorized', response.isAuthenticated);
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('Internal server error');
      setAlertStatus(500)
    }
  }

  useEffect(() => {
    const message = localStorage.getItem('signupMessage');
    const status = localStorage.getItem('signupStatus');
    if (message && status) {
      setAlertMessage(message);
      setAlertStatus(parseInt(status));
    }
    if (error) {
      const timeoutId = setTimeout(() => {
        setError({}); 
        setLogInState({
          email: '',
          password: ''
        });
      }, 15000); 
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return(
    <div className="container-fluid container-lg container-md">
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-4 col-md-4">
        <div className="card bg-light-subtle border-light-subtle shadow-sm py-2 mx-lg-2 mx-md-2">
            <div className="card-body">
            { alertMessage ? <Alert status= {alertStatus} message= {alertMessage}/> : null }
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
                  />
                  <div className="invalid-feedback d-block">
                    { error.message?.email && error.message.email }
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
                  />
                  <div className="invalid-feedback d-block">
                    { error.message?.password && error.message.password }
                  </div>
                </div>          
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-outline-success">Login</button>
                  <p>Don't have an account? <Link href="/auth/signup">signup</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogInPage;