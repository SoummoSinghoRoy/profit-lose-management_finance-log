import { useEffect, useState  } from "react";

import { signupPostRequest } from "@/utility/fetcher";
import Alert from "@/components/alert";

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  thumbnail: ''
}

interface IError {
  [key: string]: {
    [key: string]: string
  };
}

const SignUpPage = () => {
  const [signupState, setSignupState] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<IError>({});

  const changeHandler = (event: any): void => {
    const { name, value } = event.target;
    console.log(event.target.value);
    setSignupState({ ...signupState, [name]: value });
  }

  const submitHandle = async (event: any) => {
    event.preventDefault()
    console.log(signupState);
    try {
      const response = await signupPostRequest(signupState);
      if (response.status !== 200) {
        setMessage(response.message);
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
        setMessage(response.message);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setMessage('Internal server error')
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
          confirmPassword: '',
          thumbnail: ''
        });
      }, 12000); 
      return () => clearTimeout(timeoutId);
    }
  }, [error, signupState]);

  return(
    <div className="container-fluid container-lg container-md">
      <div className="row d-flex justify-content-center">
        <div className="col col-lg-6 col-md-6">
          <div className="card bg-light-subtle border-light-subtle shadow-sm mx-lg-4 mx-md-4">
            <div className="card-body">
              { message && <Alert message= {message}/> }
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
                      { error.message?.username && <p>{error.message.username}</p> }
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
                    { error.message?.email && error.message.email }
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
                  />
                  <div className="invalid-feedback d-block">
                    { error.message?.password && error.message.password }
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
                    { error.message?.confirmPassword && error.message.confirmPassword }
                  </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="thumbnail" className="form-label">Choose Thumbnail</label>
                    <input 
                      type="file" 
                      id="thumbnail"
                      name="thumbnail"
                      value={signupState.thumbnail}
                      className="form-control form-control-sm"
                      onChange={changeHandler} 
                    />
                    <div className="invalid-feedback d-block">
                    { error.message?.thumbnail && error.message.thumbnail }
                  </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-outline-success">signup</button>
                    <p>Already have an account? <a href="/auth/login">login</a></p>
                  </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SignUpPage;