import { BrowserRouter, Route, Routes } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Alert from './CommonComponents/Alert';
import { removeAlert } from './Redux/Actions/AlertActions';
import { useSelector, useDispatch } from "react-redux"
import React, { useEffect } from "react"
import { Login } from './AuthFIles/Login';
import { MasterLogin } from './AuthFIles/MasterLogin';
import { ForgotPassword } from './AuthFIles/ForgotPassword';
import { Register } from './AuthFIles/Register';
import { UploadCase } from './Components/Admin/UploadCase';
import { Dashboard } from './Components/Admin/Dashboard/Dashboard';
import { User } from './Components/Admin/User';
import PrivateRoute from './CommonComponents/PrivateRoute';
import { loadUser } from './Redux/Actions/AuthActions';
import { Assign } from "./Components/Admin/Assign/Assign"
import { ViewAllCases } from "./Components/Admin/Dashboard/ViewAllCases"
import { AssignedCases } from "./Components/Admin/Assign/AssignedCases"
import { SubmittedCase } from "./Components/Admin/SubmittedCase/SubmittedCase"
import { AssignForm } from "./CommonComponents/AssignForm"
import { UserDashboard } from "./Components/User/UserDashboard"
import { MyCases } from "./Components/User/MyCases"
import { UserProfile } from "./Components/User/UserProfile"

import { Reports } from "./Components/Admin/Reports/Reports"
import MainWrapper from "./CommonComponents/MainWrapper"
import { ResetPassword } from './AuthFIles/ResetPassword';
import { Faq } from './CommonComponents/Faq';
import { SubmitForm } from "./Components/User/SubmitForm.jsx"
import { SubmittedForm } from "./Components/Admin/SubmittedForm.jsx"
import { Instruction } from "./Components/User/Instruction.jsx"

function App() {
  const alert = useSelector(state => state.alert)
  const dispatch = useDispatch()

  const fetchUser = () => {
    dispatch(loadUser())
  }


  useEffect(() => {
    if (alert !== undefined) {
      if (alert.message !== "") {
        setTimeout(() => {
          dispatch(removeAlert())
        }, 4000);
      }
    }
  }, [alert, dispatch])


  useEffect(() => {
    fetchUser()
  }, [])


  return (
    <div className="App">
      <Alert />
      <div>

        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/admin/register" element={<Register />} />
            <Route exact path="/reset-password" element={<ResetPassword />} />
            <Route path="/master-login" element={<MasterLogin />} />
            <Route exact path="/admin/User-management" element={<PrivateRoute ><User /></PrivateRoute>} />


            <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />


            <Route path="/admin/upload" element={<PrivateRoute><UploadCase /></PrivateRoute>} />
            <Route path="/admin/documents" element={<PrivateRoute><ViewAllCases /></PrivateRoute>} />
            <Route path="/admin/documents/assign" element={<PrivateRoute><Assign /></PrivateRoute>} />
            <Route path="admin/assigned-cases" element={<PrivateRoute><AssignedCases /></PrivateRoute>} />

            <Route path="admin/submissions" element={<PrivateRoute><SubmittedCase /></PrivateRoute>} />

            <Route path="/admin/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />

            <Route path="/user/dashboard" element={<PrivateRoute>  <UserDashboard /> </PrivateRoute>} />

            <Route exact path="/user/instruction" element={<PrivateRoute ><Instruction /></PrivateRoute>} />
            <Route exact path="/admin/faq" element={<PrivateRoute ><Faq /></PrivateRoute>} />
            {/* <Route exact path="/user/faq" element={<PrivateRoute ><Faq /></PrivateRoute>} /> */}

            <Route exact path="/admin/documents/:id/assign" element={<PrivateRoute ><AssignForm /></PrivateRoute>} />
            <Route exact path="/admin/view-all/:id/assign" element={<PrivateRoute ><AssignForm /></PrivateRoute>} />

            <Route exact path="/admin/reports" element={<PrivateRoute role="admin"> <Reports /></PrivateRoute>} />
            <Route path="/user/profile" element={<PrivateRoute role="user"><UserProfile /></PrivateRoute>} />

            <Route exact path="/user/my-cases" element={<MyCases />} />
            <Route exact path="/new" element={<ResetPassword />} />
            <Route exact path="/user/work-on-case/:caseid/:id/:formid?" element={<SubmitForm></SubmitForm>}></Route>
            <Route exact path="/admin/work-on-case/:caseid/:id/:formid?" element={<SubmittedForm></SubmittedForm>}></Route>

          </Routes>
        </BrowserRouter>
      </div>
    </div>

  )
}

export default App
