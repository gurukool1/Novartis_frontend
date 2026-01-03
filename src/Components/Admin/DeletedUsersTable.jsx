import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../../CommonComponents/Pagination";

const DeletedUsersTable = ({ users, loading, onPermanentDeleteClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US',{
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "America/Los_Angeles"
        })}${date.toLocaleTimeString('en-US', {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Los_Angeles"
        })}`;
    };

    return (
        <>
            <div className="title-header mt-5">
                <div className="d-flex align-items-center justify-content-between">
                    <h3>Deleted Users</h3>
                </div>
            </div>

            <div className="table-outer mt-3">
                <div className="table-responsive scrollbar-clr">
                    <table className="table theme-table bdr">
                        <thead>
                            <tr>
                                <th className="text-start">#</th>
                                <th className="text-center">Company Name</th>
                                <th className="text-center">Investigator Name</th>
                                <th className="text-center">Username</th>
                                <th className="text-center">Email</th>
                                <th className="text-start">Registered On</th>
                                <th className="text-start">Deleted On</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td className="text-center">{user.company_name}</td>
                                        <td className="text-center">{user.investigatorName}</td>
                                        <td className="text-center">{user.username}</td>
                                        <td className="text-center">{user.email}</td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td>{formatDate(user.updatedAt)}</td>
                                        <td className="d-flex align-items-center justify-content-center">
                                            <span
                                                className="badge red me-1 mb-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => onPermanentDeleteClick(user)}
                                            >
                                                <FaTrash fontSize={12} /> Delete Permanently
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5">
                                        No deleted users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && totalPages >= 1 && (
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

export default DeletedUsersTable;