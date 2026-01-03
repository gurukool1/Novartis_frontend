import React, { useState, useEffect } from 'react'
import { BsTag } from 'react-icons/bs'
import { TbTableExport, TbTag } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { getAssignedUsersByCaseId } from '../../../Redux/Actions/userActions'
import { getAssignedCases } from '../../../Redux/Actions/CaseAction';
import { Link } from 'react-router'
import Pagination from "../../../CommonComponents/Pagination";
import ExportExcel from '../../../CommonComponents/ExportExcel'
export const Case1Assigned = ({ uniqueCaseNumber, selectedCase, setSelectedCase }) => {

    const dispatch = useDispatch();
    const { assignedCases } = useSelector(state => state.case);
    const [loader, setLoader] = useState(true)

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    useEffect(() => {
        dispatch(getAssignedCases(setLoader));
    }, []);


    useEffect(() => {
        if (uniqueCaseNumber.length > 0 && !selectedCase) {
            setSelectedCase(uniqueCaseNumber[0]);
        }
    }, [uniqueCaseNumber, selectedCase, setSelectedCase]);

    const caseAssignedUsers = assignedCases.filter(
        (item) => item.caseNumber === selectedCase
    );

    // const caseAssignedUsers = selectedCase
    //     ? assignedCases.filter(item => item.caseNumber === selectedCase)
    //     : [];

    // Load users when selected case changes
    // useEffect(() => {
    //     if (selectedCase) {
    //         setLoader(true)
    //         dispatch(getAssignedUsersByCaseId(selectedCase, setLoader));
    //     }
    // }, [selectedCase]);

    //const caseAssignedUsers = selectedCase ? (assignedUsersByCase[selectedCase] || []) : [];


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const TotalCaseAssignedUsers = caseAssignedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(caseAssignedUsers.length / itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleCaseChange = (e) => {
        setSelectedCase(e.target.value);
        // setCurrentPage(1);
    };
    // const handleCaseChange = (e) => {
    //         setSelectedCase(e.target.value);
    //         setCurrentPage(1); // reset to first page when case changes
    //     };
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'begin': return 'red';
            case 'resume': return 'yellow';
            case 'submitted': return 'green';
            default: return 'red';
        }
    };

    const exportData = caseAssignedUsers.map((user, index) => ({
        "#": index + 1,
        "Username": user.userName,
        "Email": user.userEmail,
        "Status": user.status
    }));

    return (
        <>



            <div className="row mt-3 mb-3">
                <div className="col-md-4">
                    <div className="input-wrap">
                        <label htmlFor="caseSelect" className="label" style={{ fontSize: '1.2rem' }}>Select Case:</label>
                        <div className="d-flex gap-2">
                            <select
                                id="caseSelect"
                                className="input flex-grow-1"
                                style={{ backgroundColor: 'white', border: '1px solid #71cfeeff' }}
                                value={selectedCase || ''}
                                onChange={handleCaseChange}
                            >
                                {/* <option value="">Select a case</option>
                                {uniqueCaseIds.map(caseId => (
                                    <option key={caseId} value={caseId}>
                                        Case {caseId}
                                    </option>
                                ))} */}


                                <option value="">Select a case</option>
                                {uniqueCaseNumber.map(caseNumber => (
                                    <option key={caseNumber} value={caseNumber}>
                                        {caseNumber.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
                <h3 className='d-flex align-items-center gap-2'><TbTag className='text-dark' />{selectedCase ? `Users Assigned to Case ${selectedCase}` : 'Select a Case'}</h3>
                <div className="d-flex align-items-center gap-2">

                    <ExportExcel
                        data={exportData}

                        fileName={`case_${selectedCase}_assign_report`}
                        className="site-link light-blue"
                    />
                </div>
            </div>

            <div className="table-outer mt-3">
                <div className="table-responsive scrollbar-clr">
                    <table className="table theme-table bdr">
                        <thead>
                            <tr>
                                <th className="text-start">#</th>
                                <th className="text-start">Username</th>
                                <th className="text-start">Email</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loader ? (
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
                                TotalCaseAssignedUsers.map((assignment, index) => (
                                    <tr key={assignment.id}>
                                        <td>{index + 1}</td>
                                        <td className="text-start">
                                            <span className='first-letter light-blue'>
                                                {assignment.userName.charAt(0)}
                                            </span>
                                            {assignment.userName}
                                        </td>
                                        <td className="text-start">{assignment.userEmail}</td>
                                        {/* <td className='text-center'>
                                        <span className='badge light-blue'>
                                            <TbTag /> {assignment.status}
                                        </span>
                                    </td> */}
                                        <td className='text-center'>
                                            <span className={`badge ${getStatusBadgeClass(assignment.status)}`}>
                                                {assignment.status.toLowerCase() === 'submitted' ? 'Completed' : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {!loader && totalPages >= 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    )
}


// useEffect(() => {
//         dispatch(getAssignedCases(setLoader));
//     }, [dispatch]);

//     // ✅ Auto-select first case if none selected
//     useEffect(() => {
//         if (uniqueCaseNumber.length > 0 && !selectedCase) {
//             setSelectedCase(uniqueCaseNumber[0]);
//         }
//     }, [uniqueCaseNumber, selectedCase, setSelectedCase]);

//     // ✅ Filter assigned users for selected case only
//     const caseAssignedUsers = assignedCases.filter(
//         (item) => item.caseNumber === selectedCase
//     );