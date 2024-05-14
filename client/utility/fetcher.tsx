import axios from "axios";

interface AuthApiRespone {
  [key: string]: any
};

async function signupPostRequest(signupRequestBody: any): Promise<AuthApiRespone> {
  try {
    const { data } = await axios.post('http://localhost:7272/api/auth/signup',
      signupRequestBody
    )
    return data;
  } catch (error) {
    console.log(error);
    const res: AuthApiRespone = {
      status: 500,
      message: `Internal server error`
    }
    return res;
  }
}

export { signupPostRequest };