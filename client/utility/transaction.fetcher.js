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

export async function createTransactionPostRequest(transactionRequestData, token) {
  if(token) {
    try {
      const {data} = await axios.post('http://localhost:7272/api/transaction/add',
        transactionRequestData,
        {
          headers: {
            'authorization': token
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
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}

export async function editTransactionPutRequest(transactionid, transactionEditState, token) {
  if(token) {
    try {
      const {data} = await axios.put(`http://localhost:7272/api/transaction/edit/${transactionid}`,
        transactionEditState,
        {
          headers: {
            'authorization': token
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
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}

export async function deleteTransactionRequest(transactionid, token) {
  if(token) {
    try {
      const {data} = await axios.delete(`http://localhost:7272/api/transaction/single/${transactionid}`,
        {
          headers: {
            'authorization': token
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
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}

export async function searchTransactionRequest(searchterm, token) {
  if(token) {
    try {
      const {data} = await axios.get(`http://localhost:7272/api/search//transaction/${searchterm}`,
        {
          headers: {
            'authorization': token
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
  } else {
    const res = {
      status: 401,
      message: `UnAuthorized`
    }
    return res;
  }
}