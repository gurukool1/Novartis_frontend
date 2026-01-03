import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../../CommonComponents/MainWrapper";
import { Header } from "../../../CommonComponents/Header";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { getAssignedCases } from "../../../Redux/Actions/CaseAction";
import Pagination from "../../../CommonComponents/Pagination";
export const AssignedCases = () => {
  const dispatch = useDispatch();
  const { assignedCases } = useSelector((state) => state.case);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);


  const formatUsers = (userName) => {
    return userName;
  };
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit", 
      minute: "2-digit",
      timeZone: "America/Los_Angeles"
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignedCases = assignedCases.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(assignedCases.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getAssignedCases(setLoading));
  }, []);
  return (
    <>
      <MainWrapper>
        <div className="title-header mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <h3>Assigned Cases</h3>
          </div>
        </div>

        <div className="table-outer mt-3">
          <div className="table-responsive scrollbar-clr">
            <table className="table theme-table bdr">
              <thead>
                <tr>
                  <th className="text-start">#</th>
                  <th className="text-center">Assigned Users</th>
                  <th className="text-center">Case Title</th>
                  <th className="text-start">Assigned Date & Time</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
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
                ) : Array.isArray(assignedCases) &&
                  currentAssignedCases.length > 0 ? (
                  currentAssignedCases.map((assignedCase, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td
                        className="text-center"
                        style={{ maxWidth: "200px", minWidth: "200px" }}
                      >
                        {formatUsers(assignedCase.userName)}
                      </td>
                      <td className="text-center">
                        {assignedCase.caseNumber}{" "}
                        {/* Use caseNumber instead of case.title */}
                      </td>
                      <td>{formatDate(assignedCase.assignedAt)}</td>
                      <td className="text-center">
                        {assignedCase.status === "begin" || "resume" ? ( // Use the correct status check
                          <span className="badge green me-1 mb-1">
                            <FaRegCircleCheck fontSize={16} /> Assigned
                          </span>
                        ) : (
                          <span className="badge red me-1 mb-1">
                            <RxCross2 fontSize={16} /> Unassigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No assigned cases available
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
      </MainWrapper>
    </>
  );
};
