import { Link } from 'react-router-dom'
import React, { useState } from 'react';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import appLogo from '../assets/images/appLogo.png'
import { useDispatch } from 'react-redux';
import { forgetPassword } from '../Redux/Actions/AuthActions';
export const ForgotPassword = () => {


  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    let data = {
      email: email
    }
    setLoader(true)
    dispatch(forgetPassword(data, setLoader))
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
                  <h4 className="fw-500 mb-3">Enter Your Email Address </h4>
                  <div className="input-wrap">
                    <label className='label' htmlFor="">Email:</label>
                    <input className="input"
                      type="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                      required />
                  </div>
                  <div className="input-wrap mt-4">
                    <button className='site-link lg full mt-1'><span>{loader ? <>Submitting <i className="fa fa-spinner fa-spin mx-1" /></> : "Submit"}</span></button>
                  </div>
                  <p className='link-para text-center pt-3'>Remember Password? <Link className='txt-orange' to="/">Sign In</Link></p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}
