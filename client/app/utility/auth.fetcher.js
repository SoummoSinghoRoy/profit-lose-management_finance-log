import axios from "axios";


async function signupPostRequest(signupRequestBody){
  try {
    const { data } = await axios.post('http://localhost:7272/api/auth/signup',
      signupRequestBody,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return data;
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    return res;
  }
}


async function loginPostRequest(loginRequestBody){
  try {
    const { data } = await axios.post('http://localhost:7272/api/auth/login',
      loginRequestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return data;
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    return res;
  }
}

async function logoutRequest() {
  try {
    const { data } = await axios.post('http://localhost:7272/api/auth/logout');
    console.log(data);
    return data; 
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    return res;
  }
}

export { signupPostRequest, loginPostRequest, logoutRequest };