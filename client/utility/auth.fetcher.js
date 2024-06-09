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

async function logoutRequest(token) {
  if(token) {
    try {
      const { data } = await axios.post('http://localhost:7272/api/auth/logout', {}, {
        headers: {
          'authorization': token
        },
      });
      return data; 
    } catch (error) {
      console.log(error);
      const res = {
        status: 500,
        message: `Internal server error`
      }
      return res;
    }
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}

async function changePasswordRequesut(token, userId,  changePasswordRequestBody) {
  if(token) {
    try {
      const { data } = await axios.patch(`http://localhost:7272/api/auth/edit/${userId}`,
        changePasswordRequestBody,
        {
          headers: {
            'authorization': token
          },
        }
      );
      return data; 
    } catch (error) {
      console.log(error);
      const res = {
        status: 500,
        message: `Internal server error`
      }
      return res;
    }
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}

export { signupPostRequest, loginPostRequest, logoutRequest, changePasswordRequesut };