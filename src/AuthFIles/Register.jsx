import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import appLogo from "../assets/images/appLogo.png";
import { registerUser } from "../Redux/Actions/AuthActions";
import MainWrapper from '../CommonComponents/MainWrapper'
import {
  unmountRegisterData,
  getAllCountries,
} from "../Redux/Actions/AuthActions";
//import { getAllCountries } from '../Redux/Actions/AuthActions';

// const generateCaptcha = () => {
//   const a = Math.floor(Math.random() * 10);
//   const b = Math.floor(Math.random() * 10);
//   return {
//     question: `${a} + ${b} = ?`,
//     answer: (a + b).toString(),
//   };
// };

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*', '/'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let question = '';
  let answer = '';

  switch (operator) {
    case '+':
      question = `${a} + ${b} = ?`;
      answer = (a + b).toString();
      break;
    case '*':
      question = `${a} * ${b} = ?`;
      answer = (a * b).toString();
      break;
    case '/':
      const result = a * b;
      question = `${result} / ${a} = ?`;
      answer = b.toString();
      break;
    default:
      break;
  }
  return { question, answer };
};



export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [countries, setCountries] = useState([])
  const [registerInfo, setRegisterInfo] = useState({
    investigatorName: "",
    username: "",
    siteNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    captcha_input: "",
    // phone: "",
    country: "",
    company_name: "",
    study_name: ""
  });


  useEffect(() => {
    dispatch(getAllCountries(setCountries));
  }, []);

  useEffect(() => {
    const savedForm = localStorage.getItem("registerForm");

    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      parsed.captcha_input = "";
      setRegisterInfo(parsed);
    }
    setCaptcha(generateCaptcha());
    // if (auth.registrationSuccess) {
    //   localStorage.removeItem("registerForm");
    //   navigate("/");
    //   dispatch({ type: "RESET_REGISTRATION_SUCCESS" });
    // }
    // if (auth.isAuthenticated) {
    //   navigate("/dashboard");
    // }
  }, [auth.registrationSuccess, auth.isAuthenticated, dispatch, navigate]);



  useEffect(() => {
    if (auth.registrationSuccess) {
      localStorage.removeItem("registerForm");
      navigate("/admin/User-management");
      dispatch({ type: "RESET_REGISTRATION_SUCCESS" });
    }
  }, [auth.registrationSuccess]);
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "investigatorName":
        if (!value.trim()) error = "Investigator name  is required";
        break;
      case "username":
        if (!value.trim()) error = "Username is required";
        break;
      case "siteNo":
        if (!value) error = "siteNo required";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Email is invalid";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value)
        )
          error =
            "Password must be at least 6 characters with upper, lower, number, and special char";
        break;
      case "confirmPassword":
        if (value !== registerInfo.password) error = "Passwords do not match";
        break;
      case "country":
        if (!value) error = "Country is required";
        break;

      // case "phone":
      //   if (!value) error = "Phone number is required";
      //   else if (!/^\d{10}$/.test(value))
      //     error = "Enter a valid 10-digit phone number";
      //   break;
      case "captcha_input":
        if (value !== captcha.answer) error = "Captcha answer is incorrect";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone number to a maximum of 10 digits
    if (name === "phone" && value.length > 10) return;

    // setRegisterInfo((prev) => ({ ...prev, [name]: value }));
    // validateField(name, value);
    const updatedForm = { ...registerInfo, [name]: value };
    setRegisterInfo(updatedForm);
    validateField(name, value);
    localStorage.setItem("registerForm", JSON.stringify(updatedForm));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = Object.values(errors).every((error) => !error);
    if (isFormValid) {
      setLoader(true);
      const userData = {
        investigatorName: registerInfo.investigatorName,
        username: registerInfo.username,
        siteNo: registerInfo.siteNo,
        email: registerInfo.email,
        password: registerInfo.password,
        confirmPassword: registerInfo.confirmPassword,
        // phone: registerInfo.phone,
        country: registerInfo.country,
        // country_id: data.country
        company_name: registerInfo.company_name,
        study_name: registerInfo.study_name
      };
      localStorage.setItem("investigatorName", registerInfo.investigatorName);

      dispatch(registerUser(userData, setLoader));
      localStorage.removeItem("registerForm");
      
    }
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);
  useEffect(() => {
    return () => {
      dispatch(unmountRegisterData());
      localStorage.removeItem("registerForm");
    };
  }, []);




  return (
    <>
      <MainWrapper active={false}>
        {/* <div className="login-header">
          <div className="login-logo">
            <img src={appLogo} alt="" />
          </div>
        </div> */}

        <div className="login-container">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <form className="col-lg-6" onSubmit={handleSubmit}>
                <div className="login-right">
                  <div className="login-card" style={{ background: "var(--white)" }}>
                    <h4 className="fw-500 mb-3">Create an Account</h4>

                    {/* <div className="input-wrap">
                    <label className="label">Company Name</label>
                    <input
                      className="input"
                      type="text"
                      name="investigatorName"
                      placeholder="Enter your Company Name"
                      value={registerInfo.companyName}
                      onChange={handleChange}
                      required
                    />
                    {errors.investigatorName && (
                      <span className="text-danger">{errors.companyName}</span>
                    )}
                  </div>

                  <div className="input-wrap mt-3">
                    <label className="label">Study Name</label>
                    <input
                      className="input"
                      type="text"
                      name="investigatorName"
                      placeholder="Enter your Study Name"
                      value={registerInfo.studyName}
                      onChange={handleChange}
                      required
                    />
                    {errors.investigatorName && (
                      <span className="text-danger">{errors.studyName}</span>
                    )}
                  </div> */}

                    <div className="input-wrap mt-3">
                      <label className="label">Name of Investigator</label>
                      <input
                        className="input"
                        type="text"
                        name="investigatorName"
                        placeholder="Enter your Inverstigator Name"
                        value={registerInfo.investigatorName}
                        onChange={handleChange}
                        required
                      />
                      {errors.investigatorName && (
                        <span className="text-danger">{errors.investigatorName}</span>
                      )}
                    </div>

                    {/* Username */}
                    <div className="input-wrap mt-3">
                      <label className="label">Username:</label>
                      <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={registerInfo.username}
                        onChange={handleChange}
                        required
                      />
                      {errors.username && (
                        <span className="text-danger">{errors.username}</span>
                      )}
                    </div>
                    <div className="input-wrap mt-3">
                      <label className="label">Company Name:</label>
                      <input
                        className="input"
                        type="text"
                        name="company_name"
                        placeholder="Enter your Company name"
                        value={registerInfo.company_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.company_name && (
                        <span className="text-danger">{errors.company_name}</span>
                      )}
                    </div>


                    <div className="input-wrap mt-3">
                      <label className="label">Site No:</label>
                      <input
                        className="input"
                        type="number"
                        name="siteNo"
                        // placeholder="Enter your Site Number"
                        value={registerInfo.siteNo}
                        onChange={handleChange}
                        required
                      />
                      {errors.siteNo && (
                        <span className="text-danger">{errors.siteNo}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="input-wrap mt-3">
                      <label className="label">Email:</label>
                      <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={registerInfo.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email}</span>
                      )}
                    </div>

                    <div className="input-wrap mt-3">
                      <label className="label">Password:</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="input"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={registerInfo.password}
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="pass_icon cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            top: "28%",
                            right: "10px",
                          }}
                        >
                          {showPassword ? (
                            <AiOutlineEye fontSize={18} color="black" />
                          ) : (
                            <AiOutlineEyeInvisible fontSize={18} color="black" />
                          )}
                        </span>
                      </div>
                      {errors.password && (
                        <span className="text-danger">{errors.password}</span>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="input-wrap mt-3">
                      <label className="label">Confirm Password:</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="input"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={registerInfo.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="pass_icon cursor-pointer"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{
                            position: "absolute",
                            top: "28%",
                            right: "10px",
                          }}
                        >
                          {showConfirmPassword ? (
                            <AiOutlineEye fontSize={18} color="black" />
                          ) : (
                            <AiOutlineEyeInvisible fontSize={18} color="black" />
                          )}
                        </span>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-danger">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                    {/* <div className="input-wrap mt-3">
                    <label className="label">Country:</label>
                    <select
                      className="input"
                      name="country"
                      value={registerInfo.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.code}>
                          {country.country_name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="text-danger">{errors.country}</span>
                    )}
                  </div> */}
                    <div className="input-wrap mt-3">
                      <label className="label">Study Name</label>
                      <input
                        className="input"
                        type="text"
                        name="study_name"
                        placeholder="Enter your Study name"
                        value={registerInfo.study_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.study_name && (
                        <span className="text-danger">{errors.study_name}</span>
                      )}
                    </div>
                    <div className="input-wrap mt-3">
                      <label className="label">Trial Country:</label>
                      <select
                        className="input"
                        name="country"
                        value={registerInfo.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.country_name}>
                            {country.country_name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <span className="text-danger">{errors.country}</span>
                      )}
                    </div>

                    {/* Phone Number */}
                    {/* <div className="input-wrap mt-3">
                    <label className="label">Phone Number:</label>
                    <input
                      className="input"
                      type="number"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={registerInfo.phone}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />
                    {errors.phone && (
                      <span className="text-danger">{errors.phone}</span>
                    )}
                  </div> */}

                    {/* Captcha */}
                    <div className="input-wrap mt-3">
                      <label className="label">Captcha: {captcha.question}</label>
                      <input
                        className="input"
                        type="number"
                        name="captcha_input"
                        placeholder="Enter captcha"
                        value={registerInfo.captcha_input}
                        onChange={handleChange}
                        required
                      />
                      {errors.captcha_input && (
                        <span className="text-danger">
                          {errors.captcha_input}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="input-wrap mt-4">
                      <button
                        type="submit"
                        className="site-link lg full"
                        disabled={
                          loader || Object.values(errors).some((err) => err)
                        }
                      >
                        <span>
                          Register{" "}
                          {loader && <i className="fa fa-spinner fa-spin mx-1" />}
                        </span>
                      </button>
                    </div>

                    {/* <p className="link-para text-center pt-2">
                    Already have an account?{" "}
                    <Link className="txt-orange" to="/">
                      Login
                    </Link>
                  </p> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainWrapper>
    </>
  );
};
