
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { TbTableExport } from 'react-icons/tb';
import ExportExcel from '../../../CommonComponents/ExportExcel'
import Pagination from "../../../CommonComponents/Pagination";
export const AssignedUsers = ({ assignedCases }) => {
    const uniqueUsers = [...new Map(
        assignedCases.map(item => [item.userEmail, item])
    ).values()];


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const TotaluniqueUsers = uniqueUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(uniqueUsers.length / itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const exportData = uniqueUsers.map((user, index) => ({
        "#": index + 1,
        "Username": user.userName,
        "Email": user.userEmail,
        "Status": "Assigned"
    }));
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className='d-flex align-items-center gap-2'>
                    <FaCheck className='text-dark' /> Assigned Users
                </h3>
                <div className="d-flex align-items-center gap-2">
                    <ExportExcel
                        data={exportData}
                        fileName="assigned_users_report"
                        className="green"
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
                            {TotaluniqueUsers.length > 0 ? (
                                TotaluniqueUsers.map((user, index) => (
                                    <tr key={`${user.userEmail}-${index}`}>
                                        <td>{index + 1}</td>
                                        <td className="text-start">
                                            <span className='first-letter green'>{user.userName[0]}</span>
                                            {user.userName}
                                        </td>
                                        <td className="text-start">{user.userEmail}</td>
                                        <td className='text-center'>
                                            <span className='badge green'><FaCheck /> Assigned</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No users assigned yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages >= 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
};
