import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { TbTableExport } from 'react-icons/tb'
import { LuUserRound } from 'react-icons/lu'
import Pagination from "../../../CommonComponents/Pagination";
export const TotalUser = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const TotalUser = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className='d-flex align-items-center gap-2'><LuUserRound className='text-dark' />Total Users</h3>
            </div>
            <div className="table-outer mt-3">
                <div className="table-responsive scrollbar-clr">
                    <table className="table theme-table bdr">
                        <thead>
                            <tr>
                                <th className="text-start">#</th>
                                <th className="text-start">Username</th>
                                <th className="text-start">Email</th>
                                <th className="text-start"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && TotalUser.length > 0 ? (
                                TotalUser
                                    .filter(user => user.role === 'user')
                                    .map((user, index) => (
                                        <tr key={user.userId}>
                                            <td>{index + 1}</td>
                                            <td className="text-start">
                                                <span className='first-letter blue'>{user.username[0]}</span>{user.username}
                                            </td>
                                            <td className="text-start">{user.email}</td>
                                            <td></td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No UserAssigned to this Case
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
