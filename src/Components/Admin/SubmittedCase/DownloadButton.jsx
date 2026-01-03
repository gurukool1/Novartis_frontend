import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiDownload } from 'react-icons/fi';
import { fetchFormForPDF, generateScoringSheetPDF } from '../../../Redux/Actions/FormActions';
import { setAlert } from '../../../Redux/Actions/AlertActions';
import { useSelector } from "react-redux"
const DownloadButton = ({ caseId, formId, userCaseId, onDownloadComplete, submittedByName, submittedAt }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedForms, setSelectedForms] = useState([])
  const { submittedCases } = useSelector(state => state.case);
  const submittedCase = submittedCases.find(
    (item) => item.caseid === caseId && item.formid === formId && item.id === userCaseId
  );
  //console.log(submittedCase, "submitcase")
  const { formType } = submittedCase

  useEffect(() => {
    if (formType) {
      let formsArray = [];

      if (Array.isArray(formType)) {
        formsArray = formType;
      } else if (typeof formType === 'object') {
        formsArray = Object.values(formType)
      } else if (formType === "AllForms" || formType === "all") {
        formsArray = ["AllForms"];
      } else {
        formsArray = [formType];
      }

      setSelectedForms(formsArray);
    } else {
      setSelectedForms(["AllForms"]);
    }
  }, [formType]);
  const handleDownload = async () => {
    setLoading(true);
    try {
      const formData = await dispatch(fetchFormForPDF(caseId, formId, userCaseId));
      if (formData) {

        const submittedByName = submittedCase?.user?.name || 'UnknownUser';
        const submittedAt = submittedCase?.submittedAt;


        const success = await dispatch(generateScoringSheetPDF(formData, selectedForms, submittedByName, submittedAt));
        if (!success) {
          dispatch(setAlert('Failed to generate PDF', 'danger'));
        } else {
          if (onDownloadComplete) onDownloadComplete();
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      dispatch(setAlert('Error downloading scoring sheet', 'danger'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      className="badge green me-1 mb-1"
      style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
      onClick={!loading ? handleDownload : undefined}
    >
      <FiDownload fontSize={16} /> {loading ? 'Downloading...' : 'Download'}
    </span>
  );
};

export default DownloadButton;
