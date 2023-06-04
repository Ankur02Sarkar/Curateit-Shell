import * as ActionTypes from "./action-types";


export const fetchLogin = (email, password) => ({
  type: ActionTypes.FETCH_LOGIN,
  payload: {
    request: {
      url: `/api/auth/local`,
      method: "post",
      data: {
        identifier: email,
        password: password
      }
    }
  }
});
export const signup = (lastn, email, password) => ({
  type: ActionTypes.SIGNUP,
  payload: {
    request: {
      url: `/api/auth/local/register`,
      method: "post",
      data: {
        username: lastn,
        email: email,
        password: password
      }
    }
  }
});

export const errorMsg = (data) => (
  {
    type: ActionTypes.ERROR_MSG,
    payload: {
      data
    }
  }
)
export const disableMsg = (data) => (
  {
    type: ActionTypes.DISABLE_MSG,
    payload: {
      data
    }
  }
)

export const setSocialLogin = (data) => (
  {
    type: ActionTypes.SET_SOCIAL_LOGIN,
    payload: {
      data
    }
  }
)

export const successMsg = (data) => (
  {
    type: ActionTypes.SUCCESS_MSG,
    payload: {
      data
    }
  }
)

export const forgot = (email) => ({
  type: ActionTypes.FORGOT,
  payload: {
    request: {
      url: `/api/auth/forgot-password`,
      method: "post",
      data: {
        email: email,
      }
    }
  }
});

export const emailVerification = (email) => ({
  type: ActionTypes.EMAIL_VERIFICATION,
  payload: {
    request: {
      url: `https://truemail.io/api/v1/verify/single?address_info=1&timeout=100&access_token=kKeubYX6w1uSIie83P6LVNrHv9ipd03WdViH0L78PkAqobsgnfIPpEDivr2ctbhN&email=${email}`,
      method: "get",
      data: {
        email: email,
      }
    }
  }
});
