import React, { useState, useEffect } from 'react'
import SidePanel from '../Components/Admin/SidePanel'
import UserSidePanel from '../Components/User/UserSidePanel'
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
const MainWrapper = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isUserRoute = location.pathname.startsWith('/user');
    let [activeHead, setActiveHead] = useState(false);
    const handleActive = () => {
        setActiveHead(!activeHead);
    }

    const closeSidebar = () => {
        setActiveHead(false);
    }

    useEffect(() => {
        setActiveHead(false);
    }, [location.pathname]);
    return (
        <>
            <Header activeHead={activeHead} handleActive={handleActive} />
            <div className={`page-wrap ${!activeHead ? "active" : ""}`}>
                <div className="side-nav">
                    {/* {isAdminRoute && <SidePanel />}
                    {isUserRoute && <UserSidePanel />} */}
                    {/* {isAdminRoute && <SidePanel />}
                    {isUserRoute && <UserSidePanel />} */}

                    {/* 
                    {isAdminRoute && <SidePanel closeSidebar={() => setActiveHead(false)} />}
                    {isUserRoute && <UserSidePanel closeSidebar={() => setActiveHead(false)} />} */}

                    {isAdminRoute && <SidePanel onLinkClick={closeSidebar} />}
                    {isUserRoute && <UserSidePanel onLinkClick={closeSidebar} />}


                </div>

                <div className='page-container' style={{ paddingTop: window.location.pathname === "/dashboard" ? "0" : "", position: window.location.pathname == "/audio-podcast-generator" ? "relative" : "" }}>
                    {children}
                </div>
            </div>
        </>
    )
}
export default MainWrapper

