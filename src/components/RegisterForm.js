/*global chrome*/
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { Validator } from '../utils/validations';
import { FIELD_REQUIRED } from '../utils/constants';
import { signup } from '../actions/login';
import { fetchUserDetails } from '../actions/user';
import session from '../utils/session';
import InputWithIcon from './InputWithIcon';
import SigninError from './common/signinerror';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailVerificationError, setEmailVerificationError] = useState("")

    const [loading, setLoading] = useState(false)

    const handleUserChange = (val) => {
        setEmail(val)
        setEmailVerificationError("")
        setUserError(Validator.validate("email", val, null, null, true));
    };
    const handlePasswordChange = (val) => {
        setPassword(val);
        setPasswordError(Validator.validate("password", val, 6, 30, true));
    };
    const handleUsernameChange = (val) => {
        setUsername(val)
        setUsernameError(Validator.validate("name", val, null, null, true));
    };

    const submitData = async (e) => {
        e.preventDefault();
        if (
            userError !== "" ||
            passwordError !== "" ||
            usernameError !== "" ||
            email === "" ||
            password === "" ||
            username === ""
        ) {
            if (email === "") {
                setUserError(FIELD_REQUIRED);
            } else {
                setUserError(userError);
            }
            if (username === "") {
                setUsernameError(FIELD_REQUIRED);
            } else {
                setUsernameError(usernameError);
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
                const res = await dispatch(signup(username, email, password));
                setLoading(false);
                if (res.payload.status === 200) {
                    await dispatch(fetchUserDetails())
                    navigate("/");
                    chrome.storage.sync.set({
                        'userData': {
                            token: session.token,
                            unfilteredCollectionId: session.unfiltered_collection_id,
                            apiUrl: process.env.REACT_APP_API_URL
                        }
                    })
                    navigate("/");
                }
            } catch (error) {
                setLoading(false);
            }
        }
    };



    return (
        <>
            <SigninError />
            <div className='py-4'>

                <div className='mb-4'>
                    <InputWithIcon type="text" name="last_name" placeholder="Username" value={username} onChange={(val) => handleUsernameChange(val)} />
                <span className="error-label">{usernameError}</span>
                </div>
                <div className='mb-4'>
                    <InputWithIcon type="email" name="email" placeholder="Email" value={email} onChange={(val) => handleUserChange(val)} />
                <span className="error-label">{emailVerificationError.length > 0 ? emailVerificationError : userError}</span>
                </div>
                <InputWithIcon type="password" name="password" placeholder="Password" value={password} onChange={(val) => handlePasswordChange(val)} />
                <span className="error-label">{passwordError}</span>
            </div>
            <button className="bg-blue-500 w-full py-2 text-white" disabled={loading} onClick={submitData}>{loading ? `Loading...` : "Sign Up"}</button>

        </>
    )
}

export default RegisterForm