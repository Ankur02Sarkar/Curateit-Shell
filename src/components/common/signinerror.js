import React from 'react'
import { useEffect } from "react";
import { Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { disableMsg } from '../../actions/login/index';

const SigninError = (props) => {
  const { currentErrorMsg, currentSuccessMsg } = useSelector((state) => state.login);
  const InvalidMsg = useSelector((state) => state.login.loginData);
  // console.log('InvalidMsg', InvalidMsg.length)

  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(disableMsg());
    }, 5000);
  }, [currentErrorMsg, currentSuccessMsg, dispatch]);
  return (

    <>
      {props.showError ? (
        <>
          {currentErrorMsg && (
            <Alert message={currentErrorMsg} closable type="error" showIcon />
          )}
        </>
      ) : (
        <>
          {currentErrorMsg && (
            <Alert message={InvalidMsg.length === 0?"User already register":currentErrorMsg}  closable type="error" showIcon />
          )}
          {currentSuccessMsg && (
            <Alert
              message={"Success"}
              closable
              type="success"
              showIcon
            />
          )}
        </>
      )}
    </>
  )
}

export default SigninError