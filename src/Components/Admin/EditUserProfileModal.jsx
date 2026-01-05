import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { CgClose } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const EditUserProfileModal = ({
  show,
  handleClose,
  user,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    investigatorName: "",
    username: "",
    company_name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        investigatorName: user.investigatorName || "",
        username: user.username || "",
        company_name: user.company_name || "",
        email: user.email || "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setPasswordError("");
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
      return;
    }

    const payload = {
      userId: user.id,
      investigatorName: formData.investigatorName,
      username: formData.username,
      company_name: formData.company_name,
      email: formData.email,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    onSubmit(payload);
  };

  return (
    <>
      <Modal
        className="VideoModal modal-750 faqModal"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <span className="modalClose" onClick={handleClose}>
          <CgClose />
        </span>
        <Modal.Body>
          <h4>Update User Profile</h4>
          <form onSubmit={handleSubmit}>
            <div className="input-wrap mt-3">
              <label className="label">Username:</label>
              <input
                className="input"
                style={{ color: "#f0f0f0" }}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="input-wrap mt-3">
                            <label className="label">Email:</label>
                            <input
                                className="input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div> */}

            <div className="input-wrap mt-3">
              <label className="label">Name of Investigator:</label>
              <input
                className="input"
                type="text"
                style={{ color: "#f0f0f0" }}
                name="investigatorName"
                value={formData.investigatorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrap mt-3">
              <label className="label">Name of Company</label>
              <input
                className="input"
                type="text"
                style={{ color: "#f0f0f0" }}
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrap mt-3 position-relative">
              <label className="label">New Password:</label>
              <div
                className="password-input-wrapper"
                style={{ position: "relative" }}
              >
                <input
                  className="input"
                  type="password"
                  style={{ color: "#f0f0f0" }}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
                {/* <span
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {/* {showNewPassword ? <FaEyeSlash /> : <FaEye />} */}
                {/* </span> */}
              </div>
            </div>

            <div className="input-wrap mt-3 position-relative">
              <label className="label">Confirm Password:</label>
              <div
                className="password-input-wrapper"
                style={{ position: "relative" }}
              >
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  style={{ color: "#f0f0f0" }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
                {/* <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span> */}
              </div>
              {passwordError && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  {passwordError}
                </div>
              )}
            </div>

            <div className="mt-4 text-end">
              <button
                type="button"
                className="site-link dark me-2"
                onClick={handleClose}
                disabled={loading}
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="site-link blue"
                disabled={loading}
              >
                <span>{loading ? "Updating..." : "Update Profile"}</span>
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
