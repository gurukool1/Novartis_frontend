import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa6";
import { HiArrowPath } from "react-icons/hi2";
import { FaEdit } from 'react-icons/fa';
import Pagination from "../../CommonComponents/Pagination";

const ActiveUsersTable = ({ users, loading, onEditClick, onDeleteClick, selectedCompany, setSelectedCompany, onStatusChangeClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    // const [selectedCompany, setSelectedCompany] = useState("");
    const [companyList, setCompanyList] = useState([]);


    const filteredUsers = selectedCompany
        ? users.filter(user => user.company_name === selectedCompany)
        : users;


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // setCurrentPage(1);
    };

    const handleCompanyChange = (company) => {
        setSelectedCompany(company);

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US',{
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "America/Los_Angeles"
        })} ${date.toLocaleTimeString('en-US', { 
            hour: "2-digit", 
            minute: "2-digit",
            timeZone: "America/Los_Angeles"
        })}`
        };


    useEffect(() => {
        const uniqueCompanies = [...new Set(users.map((user) => user.company_name))];
        setCompanyList(uniqueCompanies);
    }, [users]);
    useEffect(() => {
        setCurrentPage(1);
    }, [users, selectedCompany]);

    return (
        <>
            <div className="row mt-3 mb-3">
                <div className="col-md-4">
                    <div className="input-wrap">
                        <label htmlFor="companySelect" className="label" style={{ fontSize: '1.2rem' }}>
                            Select Company:
                        </label>
                        <div className="d-flex gap-2">
                            <select
                                id="companySelect"
                                className="input flex-grow-1"
                                // style={{ backgroundColor: 'white', border: '1px solid #71cfeeff' }}
                                value={selectedCompany || ''}
                                onChange={(e) => handleCompanyChange(e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {companyList.map((company, index) => (
                                    <option key={index} value={company}>
                                        {company}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                                <th className="text-center">Status</th>
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
                                        <td className="text-center">
                                            {user.isActive ? (
                                                <span className="badge green me-1 mb-1">Active</span>
                                            ) : (
                                                <span className="badge red me-1 mb-1">Inactive</span>
                                            )}
                                        </td>
                                        <td className="d-flex align-items-center justify-content-center">
                                            <span
                                                className={`badge ${user.isActive ? "yellow" : "green"} me-1 mb-1`}
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    onStatusChangeClick(
                                                        user,
                                                        user.isActive ? "inactive" : "active"
                                                    )
                                                }
                                            >
                                                <HiArrowPath fontSize={16} />{" "}
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </span>
                                            <span
                                                className="badge blue me-1 mb-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => onEditClick(user)}
                                            >
                                                <FaEdit fontSize={12} />
                                            </span>
                                            <span
                                                className="badge red me-1 mb-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => onDeleteClick(user)}
                                            >
                                                <FaTrash fontSize={12} />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5">
                                        {selectedCompany
                                            ? `No active users found for company: ${selectedCompany}`
                                            : "No active users found."
                                        }
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

export default ActiveUsersTable;