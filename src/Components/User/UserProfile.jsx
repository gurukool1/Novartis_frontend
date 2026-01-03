
import React from 'react';
import MainWrapper from '../../CommonComponents/MainWrapper';
import ProfileImg from '../../assets/images/profile-img.png';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../Redux/Actions/AuthActions';
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from 'react-icons/lu';

export const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOut = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <MainWrapper active={false}>
      <div className="title-header mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h3>My Profile</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="theme-card mt-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="user-profile">
                    <div className="d-flex align-items-center flex-column gap-3 mb-4">
                      <img src={ProfileImg} alt="Profile" />
                      <h6>{user.username}</h6>
                    </div>
                    <button className="site-link" onClick={handleOut}>
                      <span><LuLogOut /> Logout</span>
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <form>
                    <div className="input-wrap">
                      <label className="label-1">Full Name:</label>
                      <p className="input">{user.username}</p>
                    </div>
                    <div className="input-wrap mt-3">
                      <label className="label-1">Email:</label>
                      <p className="input">{user.email}</p>
                    </div>
                    <div className="input-wrap mt-3">
                      <label className="label-1">SiteNo:</label>
                      <p className="input">{user.siteNo}</p>
                    </div>
                    <div className="input-wrap mt-3">
                      <label className="label-1">Status:</label>
                      <span className={`badge ${user.isActive ? 'green' : 'red'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

