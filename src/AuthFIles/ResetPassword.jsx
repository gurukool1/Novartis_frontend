import React, { useState } from 'react'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import appLogo from '../assets/images/appLogo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import queryString from "query-string";
import { resetPassword } from '../Redux/Actions/AuthActions';
export const ResetPassword = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    let location = useLocation()

    const [loader, setLoader] = useState(false)
    const [loginInfo, setLoginInfo] = useState({
        password: null,
        confirmPassword: null,
        password_token: queryString.parse(location.search).token
    })

    const [passwordMsg, setPasswordMsg] = useState({
        msg: "",
        validation: false
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginInfo({
            ...loginInfo,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{6,}$/;
        if (loginInfo.password) {
            if (pattern.test(loginInfo.password)) {
                if ((loginInfo.password === loginInfo.confirmPassword)) {
                    setPasswordMsg({ ...passwordMsg, msg: "Password is valid!", validation: true })
                    setLoader(true);
                    dispatch(resetPassword(loginInfo, setLoader, navigate));
                } else {
                    setPasswordMsg({ ...passwordMsg, msg: "Password is not matched!", validation: true })
                }
            } else {
                setPasswordMsg({ ...passwordMsg, msg: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 alphanumeric and be at least 8 characters long.", validation: true })
            }
        }
    }


    return (
        <>
            <div className='login-header'>
                <div className='login-logo'><img src={appLogo} alt="" /></div>
            </div>

            <div className='login-container'>
                <div className='container'>
                    <div className="row align-items-center justify-content-center">
                        <form className="col-lg-6" onSubmit={handleSubmit}>
                            <div className="login-right">
                                <div className='login-card'>
                                    <h4 className="fw-500 mb-3">Reset Password</h4>
                                    <div className="input-wrap mt-3">
                                        <label className='label' htmlFor="">New Password:</label>
                                        <div style={{ position: "relative" }}>
                                            <input className="input"
                                                name="password"
                                                placeholder="Enter Your Password"
                                                type="password"

                                                onChange={handleChange}
                                                required />
                                            <span className="pass_icon cursor-pointer" style={{ position: 'absolute', top: '28%', right: '10px' }} >
                                                <AiOutlineEyeInvisible fontSize={18} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="input-wrap mt-3">
                                        <label className='label' htmlFor="">Confirm Password:</label>
                                        <div style={{ position: "relative" }}>
                                            <input className="input"
                                                name="confirmPassword"
                                                placeholder="Enter Your Confirm Password"
                                                type="password"
                                                onChange={handleChange}
                                                required />
                                            <span className="pass_icon cursor-pointer" style={{ position: 'absolute', top: '28%', right: '10px' }} >
                                                <AiOutlineEyeInvisible fontSize={18} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="input-wrap mt-3">
                                        <button className='site-link lg full mt-1'><span>Submit{loader ? <i className="fa fa-spinner fa-spin mx-1" /> : ""}</span></button>
                                    </div>
                                    <p className='link-para text-center pt-3'>Remember Password? <Link className='txt-orange' to="/forgot-password">Sign In</Link></p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}
