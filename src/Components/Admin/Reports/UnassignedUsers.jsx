import React, { useState } from 'react'
import { FaRegClock } from 'react-icons/fa6'
import ExportExcel from '../../../CommonComponents/ExportExcel'
import Pagination from "../../../CommonComponents/Pagination";
export const UnassignedUsers = ({ users, assignedCases }) => {

    const assignedEmails = new Set(assignedCases.map(item => item.userEmail));

    const unassignedUsers = users.filter(
        user => user.role === 'user' && !assignedEmails.has(user.email)
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const TotalunAssignedUsers = unassignedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(unassignedUsers.length / itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const exportData = unassignedUsers.map((user, index) => ({
        "#": index + 1,
        "Username": user.username,
        "Email": user.email,
        "Status": "UnAssigned"
    }));
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className='d-flex align-items-center gap-2'><FaRegClock className='text-dark' />Unassigned Users</h3>
                <div className="d-flex align-items-center gap-2">

                    <ExportExcel
                        data={exportData}
                        fileName="unassigned_users_report"
                        className="site-link yellow"

                    />
                    {/* <Link>
                        <button className="site-link yellow">
                            <span><TbTableExport /> Export Excel</span>
                        </button>
                    </Link> */}
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
                            {TotalunAssignedUsers.length > 0 ? (
                                TotalunAssignedUsers.map((user, index) => (
                                    <tr key={user.userId || user.email}>
                                        <td>{index + 1}</td>
                                        <td className="text-start">
                                            <span className='first-letter yellow'>
                                                {user.username?.charAt(0)}
                                            </span>
                                            {user.username}
                                        </td>
                                        <td className="text-start">{user.email}</td>
                                        <td className='text-center'>
                                            <span className='badge yellow'>
                                                <FaRegClock /> Unassigned
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No unassigned users found.
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
    )
}
