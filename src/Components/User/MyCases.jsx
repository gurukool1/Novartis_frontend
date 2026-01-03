import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../CommonComponents/MainWrapper";
import { Header } from "../../CommonComponents/Header";
import { RiFilePaperLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineFactCheck } from "react-icons/md";
import { getAssignedCases } from "../../Redux/Actions/userActions";
import { Link,useLocation } from "react-router-dom";

export const MyCases = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { assignedCases } = useSelector((state) => state.users);
  const [loader, setLoader] = useState(true);

  const activeCases = assignedCases.filter(
    (caseItem) => caseItem.isDeleted === 0
  );
  const submittedCases = assignedCases.filter(
    (caseItem) => caseItem.alreadyAssigned === 1 && caseItem.isDeleted === 1
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "America/Los_Angeles"
        });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
            hour: "2-digit", 
            minute: "2-digit",
            timeZone: "America/Los_Angeles"
        });
  };

  const getActionButtons = (caseItem) => {
    // const { formId } = caseItem;
    // const { status } = caseItem;
    const { formId, status, id, alreadyAssigned, isDeleted } = caseItem;

    const base = `/user/work-on-case/${caseItem.caseId}/${id}`;

    // const draftPath = `${base}/${formId}`;
    // const readonlyPath = `${base}/${formId}?view`;
    //const encodedFileUrl = encodeURIComponent(fileUrl || "");

    // const draftPath = `${base}/${formId}?fileUrl=${encodedFileUrl}`;
    // const readonlyPath = `${base}/${formId}?fileUrl=${encodedFileUrl}&view`;

    const draftPath = `${base}/${formId}`;
    const readonlyPath = `${base}/${formId}?view`;
    if (status === "submitted" || alreadyAssigned === 1) {
        return (
          <>
            <span className="badge user green me-1 mb-1">
              <MdOutlineFactCheck /> Submitted
            </span>

            {/* read-only view */}
            <Link to={readonlyPath} className="badge user blue me-1 mb-1">
              <AiOutlineEye /> View
            </Link>
          </>
        );
      }
      /* ---- draft in progress ---- */
      if (status === "resume" && isDeleted === 0) {
        return (
          <Link to={draftPath} className="badge user yellow me-1 mb-1">
            <LuNotebookPen /> Resume
          </Link>
        );
      }
      /* ---- never started (or anything else) ---- */
      if (status === "begin" && isDeleted === 0) {
        return (
          <Link to={`${base}`} className="badge user red me-1 mb-1">
            <RiFilePaperLine /> Begin
          </Link>
        );
      }
    
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      await dispatch(getAssignedCases(setLoader));
      setLoader(false);
    };

    fetchData();
  }, [dispatch,location.key]);
  const allCases = [...activeCases, ...submittedCases];
  return (
    <>
      <MainWrapper active={false}>
        <div className="title-header mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <h3>My Assigned Cases</h3>
          </div>
        </div>

        <div className="table-outer mt-3">
          {
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th className="text-start">Title</th>
                    <th className="text-center">Assigned Date</th>
                    <th className="text-center">Assigned Time</th>
                    <th className="text-start">Action</th>
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
                  ) : allCases.length > 0 ? (
                    allCases.map((caseItem) => (
                      <tr key={`${caseItem.caseId}-${caseItem.assignedAt}`}>
                        <td>{caseItem.Case?.title || "Untitled Case"}</td>
                        <td className="text-center">
                          {formatDate(caseItem.assignedAt)}
                        </td>
                        <td className="text-center">
                          {formatTime(caseItem.assignedAt)}
                        </td>
                        <td>{getActionButtons(caseItem)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        No case assigned to you
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </MainWrapper>
    </>
  );
};


