import React from 'react';
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline, IoIosInformationCircleOutline } from "react-icons/io"
import { IoWarningOutline } from "react-icons/io5"
import { useSelector } from 'react-redux';
//import 'animate.css';
const Alert = () => {
    const alertData = useSelector(state => state.alert)
    let obj = {
        color: alertData.type === 'success' ? "#90EE90" :
            alertData.type === 'danger' ? "#DC143C" :
                alertData.type === 'warning' ? "#FFD700" :
                    alertData.type === 'info' ? "#1E90FF" : ''
    }

    const style1 = {
        display: "flex",
        alignItems: "right",
        justifyContent: "right"
    }

    const style2 = {
        background: "rgba(0, 0, 0, 0.9)",
        maxWidth: "70%",
        minHeight: "50px",
        position: "fixed",
        zIndex: 9999999,
        top: "10px",
        right: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        color: "white",
        padding: "8px",
        fontFamily: `Open Sans, sans-serif`,
        border: alertData.type === "success" ? "" : `2px solid ${obj.color}`
    }



    const icon = alertData.type === 'success' ? <IoMdCheckmarkCircleOutline color={obj.color} /> :
        alertData.type === 'danger' ? <IoMdCloseCircleOutline color={obj.color} /> :
            alertData.type === 'warning' ? <IoWarningOutline color={obj.color} /> :
                alertData.type === 'info' ? <IoIosInformationCircleOutline color={obj.color} /> : ''
    return (
        alertData.message !== "" && alertData.message !== undefined ?
            <div style={style1} >
                <div
                    className={`animate__bounceInRight animate__animated ${alertData.type === 'success' ? "linear-border" : ""}`}
                    style={style2}>
                    <div className='animate__heartBeat animate__animated animate__delay-1s pb-1' style={{ fontSize: 25 }}>
                        {icon}
                    </div>
                    <div style={{ marginLeft: 20, fontSize: 17 }}>
                        <span>{alertData.message}</span>
                    </div>
                </div>
            </div > : ''
    );
}

export default Alert;
