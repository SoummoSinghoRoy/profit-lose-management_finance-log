import axios from "axios";

export async function fetchAllTransactionRequest(token) {
  if(token) {
    try {
      const {data} = await axios.get('http://localhost:7272/api/transaction/all', {
        headers: {
          'authorization': token
        }
      })
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