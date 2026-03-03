import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../CommonComponents/MainWrapper";
import { Header } from "../../CommonComponents/Header";
import { RiFilePaperLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineFactCheck } from "react-icons/md";
import { getAssignedCases } from "../../Redux/Actions/userActions";
import { Link, useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const { assignedCases } = useSelector((state) => state.users);

  // useEffect(() => {
  //   dispatch(getAssignedCases());
  // }, []);

  const activeCases = assignedCases.filter(
    (caseItem) => caseItem.isDeleted === 0
  );

  const totalCases = activeCases.length;
  const completedCases = activeCases.filter(
    (caseItem) =>
      caseItem.status === "completed" || caseItem.status === "submitted"
  ).length;

  const submittedCases = assignedCases.filter(
    (caseItem) => caseItem.alreadyAssigned === 1 && caseItem.isDeleted === 1
  );

  const pendingCases = totalCases - completedCases;

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

   useEffect(() => {
        const handleBack = () => {
            window.history.pushState({ from: "master-login" }, "", window.location.href);
        };

        handleBack();
        window.addEventListener("popstate", handleBack);

        return () => window.removeEventListener("popstate", handleBack);
    }, []);

  const getActionButtons = (caseItem) => {
    // const { formId } = caseItem;
    // const { status } = caseItem;
    const { formId, status, id, alreadyAssigned, isDeleted } = caseItem;
console.log("Case Item in getActionButtons:", caseItem);
    const base = `/user/work-on-case/${caseItem.caseId}/${id}`;


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
  }, []);
  const allCases = [...activeCases, ...submittedCases];
  return (
    <>
      <MainWrapper active={false}>
        <div className="title-header mt-3">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="theme-card text-center blue">
                <h5 className="mb-2">Total Cases</h5>
                <h4>{totalCases}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="theme-card text-center green">
                <h5 className="mb-2">Completed Cases</h5>
                <h4>{completedCases}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="theme-card text-center yellow">
                <h5 className="mb-2">Pending Cases</h5>
                <h4>{pendingCases}</h4>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <h3>Assigned Cases</h3>
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

