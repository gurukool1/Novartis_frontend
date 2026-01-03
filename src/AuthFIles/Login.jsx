import React, { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import appLogo from '../assets/images/appLogo.png'
import { useSelector, useDispatch } from "react-redux"
import { loginUser } from '../Redux/Actions/AuthActions';

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)
  const [loader, setLoader] = useState(false)
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  })

  // useEffect(() => {
  //   if (auth.isAuthenticated && auth.user?.role) {
  //     const dashboardPath = auth.user.role === 'admin'
  //       ? '/admin/dashboard'
  //       : '/user/dashboard';
  //     navigate(dashboardPath);
  //   }
  // }, [auth]);


  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated && auth.user?.role) {
      const dashboardPath = auth.user.role === 'admin'
        ? '/admin/dashboard'
        : '/user/dashboard';
      navigate(dashboardPath);
    }
  }, [auth]);



  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo({
      ...loginInfo,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoader(true)
    dispatch(loginUser(loginInfo, setLoader))
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
                  <h4 className="fw-500 mb-3">Login to <span className="gradient-txt">GuruKool</span></h4>
                  <div className="input-wrap">
                    <label className='label' htmlFor="">Email:</label>
                    <input className="input"
                      type="email"
                      name="email"
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      required />
                  </div>
                  <div className="input-wrap mt-3">
                    <label className='label' htmlFor="">Password:</label>
                    <div style={{ position: "relative" }}>
                      <input className="input"
                        name="password"
                        placeholder="Enter Your Password"
                        type="password"
                        onChange={handleChange}
                        required />
                      {/* <span className="pass_icon cursor-pointer" style={{ position: 'absolute', top: '28%', right: '10px' }} >
                        <AiOutlineEyeInvisible fontSize={18} />
                      </span> */}
                    </div>
                  </div>
                  <div className="input-wrap mt-3">
                    <button className='site-link lg full mt-1'><span>Login{loader ? <i className="fa fa-spinner fa-spin mx-1" /> : ""}</span></button>
                  </div>
                  <p className='link-para text-center pt-3'>Forgot Password? <Link className='txt-orange' to="/forgot-password">Click Here</Link></p>
                  {/* <p className='link-para text-center pt-2'>Don't have an account? <Link className='txt-orange' to="/register">Register</Link></p> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}