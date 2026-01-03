import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MainWrapper from '../../../CommonComponents/MainWrapper';
import { IoEyeOutline } from 'react-icons/io5';
import { getSubmittedCases } from '../../../Redux/Actions/CaseAction';
import DownloadButton from './DownloadButton';
import { MdOutlineFactCheck } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import ExportExcel from '../../../CommonComponents/ExportExcel';
export const SubmittedCase = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { submittedCases } = useSelector(state => state.case);
  // console.log(submittedCases, "sub")
  useEffect(() => {
    dispatch(getSubmittedCases(setLoading));
  }, []);

  const refreshSubmittedCases = () => {
    dispatch(getSubmittedCases(setLoading));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "America/Los_Angeles"
        });
  };


  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', { 
            hour: "2-digit", 
            minute: "2-digit",
            timeZone: "America/Los_Angeles"
        });

  const getModuleName = (formTypeObj = {}) => {
    const map = {
      Physician: "PhGA",
      AllForms: "All Modules",
    };

    return Object.values(formTypeObj)
      .map(v => map[v] || v)
      .join(", ");
  };

  const exportData = useMemo(() => {
    if (!submittedCases || !Array.isArray(submittedCases) || submittedCases.length === 0) {
      return [];
    }

    return submittedCases.map((item) => ({
      "Submitted By": item.User?.username || "N/A",
      "Case Title": item.Case?.title || "N/A",
      "Module Name": getModuleName(item.formType) || "N/A",
      "Submit Date": formatDate(item.submittedAt),
      "submit Time": formatTime(item.submittedAt)
    }));
  }, [submittedCases]);




  const getActionButtons = (caseItem) => {
    const { formId, status, id, alreadyAssigned } = caseItem; // Get formType from caseItem
    const base = `/admin/work-on-case/${caseItem.caseId}/${id}`;
    //const encodedFileUrl = encodeURIComponent(fileUrl || "");

    // Pass formType as query parameter
    // const draftPath = `${base}/${formId}`;
    const readonlyPath = `${base}/${formId}?view`;

    //   return (
    //     // ... existing buttons ...
    //   );
    // };
    // // ... existing code ...



    return (
      <>

        {alreadyAssigned === 1 && (
          <>
            {/* <span className="badge green me-1 mb-1">
              <MdOutlineFactCheck /> Submitted
            </span> */}

            <Link to={readonlyPath} className="badge blue me-1 mb-1">
              <AiOutlineEye /> View
            </Link>
          </>
        )}

      </>
    );
  };

  return (
    <MainWrapper>



      <div className="title-header mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h3>Submitted Cases</h3>
          <ExportExcel
            data={exportData}
            fileName="submittedCase_report"
            className="green"
          />
        </div>
      </div>

      {/* <div className="chart-container">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <h3>Cases Management</h3>
          <ExportExcel
            data={exportData}
            fileName="summary_report"
            className="green"
          />
        </div> */}


      <div className="table-outer mt-3">
        <div className="table-responsive scrollbar-clr">
          <table className="table theme-table bdr">
            <thead>
              <tr>
                <th className="text-start">Submitted By</th>
                <th className="text-center">Case</th>
                <th className="text-center">Module Name</th>
                <th className="text-center">Date</th>
                <th className="text-center">Time</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : submittedCases.length > 0 ? (
                submittedCases.map((submittedCase) => (
                  <tr key={submittedCase.id}>
                    <td>{submittedCase.user.name}</td>
                    <td className="text-center">{submittedCase.case.title}</td>
                    <td className='text-center'>{getModuleName(submittedCase.formType)}</td>
                    <td className="text-center">{formatDate(submittedCase.submittedAt)}</td>
                    <td className="text-center">{formatTime(submittedCase.submittedAt)}</td>
                    <td className="d-flex align-items-center justify-content-center">
                      {getActionButtons(submittedCase)}

                      <DownloadButton
                        caseId={submittedCase.caseid}
                        formId={submittedCase.formid}
                        userCaseId={submittedCase.id}
                        submittedByName={submittedCase.user.name}
                        submittedAt={submittedCase.submittedAt}
                        onDownloadComplete={refreshSubmittedCases}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No Submitted cases yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainWrapper>
  );
};





































