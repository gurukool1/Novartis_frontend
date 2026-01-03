import { FaTrash } from "react-icons/fa6";
import { Header } from "../../../CommonComponents/Header";
import MainWrapper from "../../../CommonComponents/MainWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCases } from "../../../Redux/Actions/CaseAction";
import { deleteCaseById } from "../../../Redux/Actions/CaseAction";
import { Link } from 'react-router-dom';
import CommonAlert from "../../../CommonComponents/CommonAlert";
import Pagination from "../../../CommonComponents/Pagination";
export const ViewAllCases = () => {
  const dispatch = useDispatch();
  const { cases } = useSelector((state) => state.case);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [loader, setLoader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteLoader, setDeleteLoader] = useState(false);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const ViewAllCases = cases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cases.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleDeleteConfirmation = (id) => {
    setSelectedCaseId(id);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedCaseId) {
      setDeleteLoader(true)
      await dispatch(deleteCaseById(selectedCaseId));
      setDeleteLoader(false)
    }

    setShowDeleteAlert(false);
    setSelectedCaseId(null);
  };

  useEffect(() => {
    setLoader(true)
    dispatch(getAllCases(setLoader));
  }, []);



  return (
    <>
      <MainWrapper>
        <div className="title-header mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <h3>Uploaded Documents</h3>
          </div>
        </div>

        <div className="table-outer mt-3">
          <div className="table-responsive scrollbar-clr">
            <table className="table theme-table bdr">
              <thead>
                <tr>
                  <th className="text-start">Title</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loader ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) :
                  cases && ViewAllCases.length > 0 ? (
                    ViewAllCases.map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td>{caseItem.title}</td>
                        <td className="text-center">
                          {new Date(caseItem.createdAt).toLocaleDateString('en-US',{
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                              timeZone: "America/Los_Angeles"
                          })}
                        </td>
                        <td className="text-center">
                          {new Date(caseItem.createdAt).toLocaleTimeString('en-US', { 
                              hour: "2-digit", 
                              minute: "2-digit",
                              timeZone: "America/Los_Angeles"
                          })}
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            {/* <Link to={`/admin/view-all/${caseItem.id}/assign`}> */}
                            <Link
                              to={`/admin/view-all/${caseItem.id}/assign`}
                              state={{ caseTitle: caseItem.title }}
                            >
                              <span className="badge yellow me-1 mb-1">Assign</span>
                            </Link>

                            <span
                              className="badge red me-1 mb-1"
                              onClick={() => handleDeleteConfirmation(caseItem.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <FaTrash fontSize={12} />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Uploaded document available
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>

            <CommonAlert
              show={showDeleteAlert}
              handleClose={() => setShowDeleteAlert(false)}
              handleConfirm={handleDeleteConfirmed}

              message={"Are you sure you want to delete this case?"}
              // confirmButton={"Delete"}
              // cancelButton={"Cancel"}
              confirmButton={
                <span>
                  {deleteLoader ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </span>
              }
              cancelButton={"Cancel"}
            />

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
      </MainWrapper>
    </>
  );
}
