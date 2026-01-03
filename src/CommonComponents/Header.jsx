import React, { useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import Dropdown from 'react-bootstrap/Dropdown';
import { LuLogOut } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, loadUser } from '../Redux/Actions/AuthActions';
import profileImg from '../assets/images/profile-img.png';
import { CgProfile } from 'react-icons/cg';

export const Header = ({ activeHead, handleActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!user && token) {
  //     dispatch(loadUser());
  //   }
  // }, [dispatch, user, token]);

  const handleOut = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className={`site-header ${!activeHead ? "active" : ""}`}>
      <div className="header-left">
        <div className="navToggle" style={{ cursor: "pointer" }} onClick={handleActive}>
          <RxHamburgerMenu fontSize={22} />
        </div>
      </div>
      <div className="header-right">
        <Dropdown className="drop-style-1">
          <Dropdown.Toggle variant="" className="user-btn" id="dropdown-basic">
            <div className="drop-img"><img src={profileImg} alt="Profile" /></div>
            <div className="drop-info sm-hide-drop-info text-start">
              <h6>{user?.username || "Guest"}</h6>
              <p>{user?.email || ""}</p>
            </div>
            <IoIosArrowDown />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {user?.role === "user" && (
              <NavLink to="/user/profile" className="dropdown-item">
                <CgProfile /> My Profile
              </NavLink>
            )}
            <NavLink to="/" onClick={handleOut} style={{ cursor: 'pointer' }} ><LuLogOut /> Logout</NavLink>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};
