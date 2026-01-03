import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../CommonComponents/MainWrapper";
import CommonAlert from "../../CommonComponents/CommonAlert";
import { EditUserProfileModal } from "../../Components/Admin/EditUserProfileModal";
import ActiveUsersTable from "./ActiveUsersTable";
import DeletedUsersTable from "./DeletedUsersTable";
import { Link } from 'react-router-dom';
import {
  getUsers,
  updateUserStatus,
  deleteUser,
  editUserDetails,
  permanentDeleteUser
} from "../../Redux/Actions/userActions";

export const User = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [showPermanentDeleteAlert, setShowPermanentDeleteAlert] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoader, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);


  const activeUsers = users.filter(user => user.isDeleted === 0);
  const deletedUsers = users.filter(user => user.isDeleted === 1);

  const handleEditClick = (user) => {
    setSelectedUserForEdit(user);
    setShowEditModal(true);
  };


  const handleEditSubmit = (payload) => {
    setEditLoading(true);
    const prevCompany = selectedUserForEdit?.company_name;
    dispatch(editUserDetails(payload, () => {
      setEditLoading(false);
      setShowEditModal(false);


      if (payload.company_name && payload.company_name !== prevCompany) {
        setSelectedCompany(payload.company_name);
      }
    }));
  };

  const handleDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setShowDeleteAlert(true);
  };

  const handleStatusChangeConfirmation = (user, status) => {
    setSelectedUser(user);
    setNewStatus(status);
    setShowStatusAlert(true);
  };

  const handlePermanentDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setShowPermanentDeleteAlert(true);
  };

  const handleDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id, setActionLoading));
    }
    setShowDeleteAlert(false);
    setSelectedUser(null);
    setSelectedCompany("");
  };

  const handlePermanentDelete = () => {
    if (selectedUser) {
      dispatch(permanentDeleteUser(selectedUser.id, setActionLoading));
    }
    setShowPermanentDeleteAlert(false);
    setSelectedUser(null);
  };

  const handleStatusChange = () => {
    if (selectedUser) {
      dispatch(updateUserStatus(selectedUser.id, newStatus, setActionLoading));
    }
    setShowStatusAlert(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getUsers(setLoading));
  }, []);

  return (
    <MainWrapper>
      <div className="title-header mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h3>User Management</h3>
          <div className='d-flex gap-3'>
            <div className='d-flex align-items-center gap-2'>
              <Link to="/master-login">
                <button className='site-link'><span>Master Login</span></button>
              </Link>
            </div>
          </div>
        </div>
        {/* <Link to="/master-login">
          <button className='site-link'><span>Master Login</span></button>
        </Link> */}
      </div>

      <ActiveUsersTable
        users={activeUsers}
        loading={loading}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteConfirmation}
        onStatusChangeClick={handleStatusChangeConfirmation}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />


      <DeletedUsersTable
        users={deletedUsers}
        loading={loading}
        onPermanentDeleteClick={handlePermanentDeleteConfirmation}
      />


      <CommonAlert
        show={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
        handleConfirm={handleDelete}
        message={"Are you sure you want to delete this user?"}
        confirmButton={
          <span>
            {actionLoader ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </span>
        }
        confirmDisabled={actionLoader}
        cancelButton="Cancel"
      />

      <CommonAlert
        show={showPermanentDeleteAlert}
        handleClose={() => setShowPermanentDeleteAlert(false)}
        handleConfirm={handlePermanentDelete}
        message={"Are you sure you want to permanently delete this user?"}
        confirmButton={
          <span>
            {actionLoader ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </span>
        }
        confirmDisabled={actionLoader}
        cancelButton="Cancel"
      />

      <CommonAlert
        show={showStatusAlert}
        handleClose={() => setShowStatusAlert(false)}
        handleConfirm={handleStatusChange}
        message={`Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"
          } this user?`}
        confirmButton={newStatus === "active" ? "Activate" : "Deactivate"}
        cancelButton={"Cancel"}
      />

      <EditUserProfileModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={selectedUserForEdit}
        onSubmit={handleEditSubmit}
        loading={editLoading}

      />
    </MainWrapper>
  );
};

