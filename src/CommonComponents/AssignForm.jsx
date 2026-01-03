import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "./MainWrapper";
import { Header } from "./Header";
import { MdFormatAlignRight, MdOutlineAssignment } from "react-icons/md";
import { FaSpinner } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleCheck, FaRegFileLines } from "react-icons/fa6";
import CommonAlert from "../CommonComponents/CommonAlert";
import {
  getUsers,
  assignCaseToMultipleUsers,
  getAssignedUsers,
  unassignCaseFromUser,
} from "../Redux/Actions/userActions";
import { setAlert } from "../Redux/Actions/AlertActions";

export const AssignForm = () => {
  const { id: caseId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { caseTitle } = location.state || {};

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUnassignAlert, setShowUnassignAlert] = useState(false);
  const [userToUnassign, setUserToUnassign] = useState(null);
  const [selectedForms, setSelectedForms] = useState([]);
  const [showFormsDropdown, setShowFormsDropdown] = useState(false);

  const users = useSelector((state) => state.users.users);
  const assignedUsers = useSelector((state) => state.users.assignedUsers);
  const isLoading = useSelector((state) => state.users.loading);
  const formsDropdownRef = useRef(null);

  const [loader, setLoader] = useState({
    assigning: false,
    fetching: true,
    unassigning: false,
  });

  // Form options
  const formOptions = [
    { value: "MMT8", label: "MMT8" },
    { value: "CDASI", label: "CDASI" },
    { value: "MDAAT", label: "MDAAT" },
    { value: "Physician", label: "Physican Global" },
    { value: "AllForms", label: "All forms" }
  ];

  const getFormLabel = (value) => {
    const f = formOptions.find((o) => o.value === value);
    return f ? f.label : value;
  };
  const handleFormCheckboxChange = (formValue) => {
    if (formValue === "AllForms") {
      setSelectedForms(prev =>
        prev.includes("AllForms") ? [] : ["AllForms"]
      );
      return;
    }

    setSelectedForms(prev => {
      const withoutAll = prev.filter(f => f !== "AllForms");

      const next = withoutAll.includes(formValue)
        ? withoutAll.filter(f => f !== formValue)
        : [...withoutAll, formValue];

      return next;
    });
  };



  const isFormSelected = (formValue) => {
    return selectedForms.includes(formValue);
  };


  const getSelectedFormsText = () => {
    const nonAllValues = formOptions.filter(f => f.value !== "AllForms").map(f => f.value);
    const pickedNonAll = selectedForms.filter(v => v !== "AllForms");

    if (pickedNonAll.length === 0 && !selectedForms.includes("AllForms")) {
      return "Select form";
    }
    if (selectedForms.includes("AllForms") || pickedNonAll.length === nonAllValues.length) {
      return "All forms";
    }
    return `${pickedNonAll.length} form(s) selected`;

  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleAssignMultiple = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      dispatch(setAlert("Please select at least one user", "danger"));
      return;
    }

    if (selectedForms.length === 0) {
      dispatch(setAlert("Please select at least one form", "danger"));
      return;
    }

    setLoader(prev => ({ ...prev, assigning: true }));

    const userIds = selectedUsers.map(user => user.id);
    // const formType = selectedForms;

    const formType = selectedForms.includes("AllForms")
      ? ["AllForms"]
      : selectedForms;


    const result = await dispatch(assignCaseToMultipleUsers(caseId, userIds, formType));

    if (result?.status) {
      setSelectedUsers([]);
      setSelectedForms([]);
      await dispatch(getAssignedUsers(caseId));
    }

    setLoader(prev => ({ ...prev, assigning: false }));
  };

  // const handleUnassignConfirmation = (userId) => {
  //   setUserToUnassign(userId);
  //   setShowUnassignAlert(true);
  // };

  const handleUnassignConfirmation = (assigned) => {
    setUserToUnassign(assigned);
    setShowUnassignAlert(true);
  };


  // const handleUnassign = async (userId) => {
  //   setLoader(prev => ({ ...prev, unassigning: true }));
  //   await dispatch(unassignCaseFromUser({ userId, caseId, formTypes: selectedForms }));
  //   dispatch(getAssignedUsers(caseId));
  //   setLoader(prev => ({ ...prev, unassigning: false }));
  //   setShowUnassignAlert(false);
  //   setUserToUnassign(null);
  // };

  const handleUnassign = async () => {
    if (!userToUnassign) return;

    setLoader(prev => ({ ...prev, unassigning: true }));



    await dispatch(unassignCaseFromUser({

      userCaseId: userToUnassign.id,
    }));

    dispatch(getAssignedUsers(caseId));
    setLoader(prev => ({ ...prev, unassigning: false }));
    setShowUnassignAlert(false);
    setUserToUnassign(null);
  };

  useEffect(() => {
    dispatch(getUsers());
    setLoader(prev => ({ ...prev, fetching: true }));
    dispatch(getAssignedUsers(caseId)).finally(() => {
      setLoader(prev => ({ ...prev, fetching: false }));
    });





    const handleClickOutside = (event) => {
      if (formsDropdownRef.current && !formsDropdownRef.current.contains(event.target)) {
        setShowFormsDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [caseId, dispatch]);

  return (
    <>
      <MainWrapper>
        <div className="theme-card mt-3">
          <div className="d-flex flex-wrap gap-2 align-items-center card-title">
            <span>
              <MdFormatAlignRight fontSize={18} />
            </span>
            <h6>Assign Document</h6>
          </div>
          <div className="mt-3" style={{ padding: "0.75rem" }}>
            <div className="d-flex align-items-center gap-2">
              <FaRegFileLines fontSize={18} color="var(--text-1)" />
              <p style={{ fontSize: "1rem", fontWeight: "500" }}>
                Document Title: {caseTitle}
              </p>
            </div>
            <hr className="horizontal-rule" />
            <form onSubmit={handleAssignMultiple}>
              <div className="input-wrap">
                <label htmlFor="userSelect" className="label">
                  Select Users:
                </label>
                <div className="d-flex gap-2">
                  <select
                    id="userSelect"
                    className="input flex-grow-1"
                    value=""
                    onChange={(e) => {
                      const userId = parseInt(e.target.value);
                      const user = users.find((u) => u.id === userId);

                      if (user && !selectedUsers.some(u => u.id === userId)) {
                        setSelectedUsers([...selectedUsers, user]);
                      } else if (selectedUsers.some(u => u.id === userId)) {
                        dispatch(setAlert("User already selected", "danger"));
                      }
                    }}
                    disabled={isLoading}
                  >
                    <option value="">Select a user</option>
                    {users
                      .filter((user) => user.role === "user" && user.isDeleted === 0)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="input-wrap mt-2">
                <label className="label">
                  Select Forms:
                </label>
                <div className="dropdown" ref={formsDropdownRef}>
                  <button
                    type="button"
                    className="input text-start dropdown-toggle"
                    onClick={() => setShowFormsDropdown(!showFormsDropdown)}
                    style={{ cursor: "pointer" }}
                  >
                    {getSelectedFormsText()}
                  </button>

                  {showFormsDropdown && (
                    <div
                      className="dropdown-menu show p-3"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        overflowY: "auto",
                        zIndex: 1000
                      }}
                    >
                      {formOptions.map((form) => (
                        <div key={form.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`form-${form.value}`}
                            checked={isFormSelected(form.value)}
                            onChange={() => handleFormCheckboxChange(form.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`form-${form.value}`}
                            style={{ cursor: "pointer" }}
                          >
                            {form.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {(selectedUsers.length > 0 || selectedForms.length > 0) && (
                <div className="mt-3 p-2">
                  <div className="d-flex flex-wrap align-items-start gap-2">
                    {/* Users */}
                    {selectedUsers.length > 0 && (
                      <div className="d-flex align-items-start gap-1">
                        <strong className="mt-1 text-dark">Users:</strong>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedUsers.map((user) => (
                            <div key={user.id} className="d-flex align-items-center bg-black px-2 py-1 rounded">
                              <span>{user.username} ({user.email})</span>
                              <button
                                type="button"
                                className="btn btn-sm text-danger ms-2"
                                onClick={() => removeUser(user.id)}
                              >
                                <RxCross2 />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Forms */}
                    {selectedForms.length > 0 && (
                      <div className="d-flex align-items-start gap-1">
                        <strong className="mt-1 text-dark">Forms:</strong>


                        {selectedForms.map((formValue) => (
                          <div key={formValue} className="d-flex align-items-center bg-black px-2 py-1 rounded">
                            <span>{getFormLabel(formValue)}</span>
                            <button
                              type="button"
                              className="btn btn-sm text-danger ms-2"
                              onClick={() => handleFormCheckboxChange(formValue)}
                              aria-label="Unselect form"
                              title="Unselect form"
                            >
                              <RxCross2 />
                            </button>
                          </div>
                        ))
                        }
                      </div>

                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 text-end">
                <button
                  type="submit"
                  className="site-link"
                  disabled={loader.assigning || selectedUsers.length === 0 || selectedForms.length === 0}
                >
                  <span>
                    {loader.assigning ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <FaRegCircleCheck />
                    )}
                    {loader.assigning ? " Assigning..." : " Assign"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="theme-card mt-3">
          <div className="theme-card mt-3">
            <div className="d-flex flex-wrap gap-2 align-items-center card-title">
              <span>
                <MdOutlineAssignment fontSize={18} />
              </span>
              <h6>Assigned Users</h6>
            </div>
            <div className="table-outer mt-3">
              <div className="table-responsive scrollbar-clr">
                <table className="table theme-table bdr">
                  <thead>
                    <tr>
                      <th className="text-start">#</th>
                      <th className="text-center">Username</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loader.fetching ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) :
                      assignedUsers.length > 0 ? (
                        assignedUsers
                          .map((assigned, index) => (
                            <tr key={assigned.userId}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {assigned.User.username}
                              </td>
                              <td className="text-center">{assigned.User.email}</td>
                              <td className="d-flex align-items-center justify-content-center">
                                <span
                                  className="badge red me-1 mb-1"
                                  onClick={() =>
                                    handleUnassignConfirmation(assigned)
                                  }
                                >
                                  <RxCross2 fontSize={16} /> Unassign
                                </span>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No users assigned yet
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <CommonAlert
          show={showUnassignAlert}
          handleClose={() => setShowUnassignAlert(false)}
          // handleConfirm={() => handleUnassign(userToUnassign)}
          handleConfirm={handleUnassign}
          message={"Are you sure you want to unassign this user?"}
          cancelButton={"Cancel"}
          confirmButton={
            <span>
              {loader.unassigning ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Unassigning...
                </>
              ) : (
                "Unassign"
              )}
            </span>
          }
        />
      </MainWrapper>
    </>
  );
};