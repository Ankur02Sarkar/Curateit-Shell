/*global chrome*/
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import {
    useDispatch,
    useSelector
} from "react-redux";
import InputWithIcon from './InputWithoutIcon';
import { Validator } from '../utils/validations';
import { FIELD_REQUIRED } from '../utils/constants';
import { fetchLogin } from '../actions/login';
import { fetchUserDetails } from '../actions/user';
import session from '../utils/session';
import Error from './common/error';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleUserChange = (val) => {
        setEmail(val)
        setUserError(Validator.validate("email", val, null, null, true));
    };
    const handlePasswordChange = (val) => {
        setPassword(val);
        setPasswordError(Validator.validate("password", val, 6, 30, true));
    };

    const submitData = async (e) => {
        console.log("login in.....");
        e.preventDefault();
        if (
            userError !== "" ||
            passwordError !== "" ||
            email === "" ||
            password === ""
        ) {
            if (email === "") {
                setUserError(FIELD_REQUIRED);
            } else {
                setUserError(userError);
            }
            if (password === "") {
                setPasswordError(FIELD_REQUIRED);
            } else {
                setPasswordError(passwordError);
            }
            return;
        }
        setLoading(true);
        if (email !== "") {
            try {
                const res = await dispatch(fetchLogin(email, password));
                setLoading(false);
                if (res.payload.status === 200) {
                    await dispatch(fetchUserDetails())
                    chrome.storage.sync.set({
                        'userData': {
                            token: session.token,
                            userId: session.userId,
                            unfilteredCollectionId: session.unfiltered_collection_id,
                            apiUrl: process.env.REACT_APP_API_URL
                        }
                    });
                    navigate("/");
                }
                else {
                    navigate("/login")
                }
            } catch (error) {
                setLoading(false);
            }
        }
    };


    return (
        <>
            <Error />
            <div className='py-4'>
                <div className='mb-4'>
                    <InputWithIcon value={email} onChange={(val) => handleUserChange(val)} type="email" name="email" placeholder="Email" />
                    <span className="error-label">{userError}</span>
                </div>
                <div className='mb-4'>
                    <InputWithIcon value={password} onChange={(val) => handlePasswordChange(val)} type="password" name="password" placeholder="Password" />
                    <span className="error-label">{passwordError}</span>
                </div>
            </div>
            <div className='mt-4'>
                <button onClick={submitData} disabled={loading} className="bg-blue-500 w-full py-2 text-white">{loading ? `Loading...` : "Sign in"}</button>
            </div>
        </>
    )
}

export default LoginForm