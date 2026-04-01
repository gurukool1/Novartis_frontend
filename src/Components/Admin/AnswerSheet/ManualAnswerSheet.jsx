import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitAnswerSheet, getAnswerSheet, updateMasterSheet, deleteAnswerSheet } from '../../../Redux/Actions/AnswerSheetAction';
import { getAllCases } from '../../../Redux/Actions/CaseAction';
import { setAlert } from '../../../Redux/Actions/AlertActions';
import CommonAlert from '../../../CommonComponents/CommonAlert';
import { normalizeScoresToRange, validateRangeScores, isRangeValue } from '../../../CommonComponents/caseFormManual/rangeUtils';
import Form1 from "../../../CommonComponents/caseFormManual/form1";
import Form2 from "../../../CommonComponents/caseFormManual/form2";
import Form3 from "../../../CommonComponents/caseFormManual/form3";
import Form4 from "../../../CommonComponents/caseFormManual/form4";
import Form5 from "../../../CommonComponents/caseFormManual/form5";
import Form6 from "../../../CommonComponents/caseFormManual/form6";
import Form7 from "../../../CommonComponents/caseFormManual/form7";
import Form8 from "../../../CommonComponents/caseFormManual/form8";
import Form9 from "../../../CommonComponents/caseFormManual/form9";
const ManualAnswerSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cases } = useSelector(state => state.case);
    const { user } = useSelector((state) => state.auth);
    console.log("User in ManualAnswerSheet:", user);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answerData, setAnswerData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(''); // 'update' | 'delete'
  const [pendingPayload, setPendingPayload] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //console.log(answerData.id, "ANSWER DATA IN COMPONENT");
  const isEditMode = Boolean(answerData?.id);


  useEffect(() => {

  if (!selectedCaseId) return;
  if (selectedCaseId) {
    setLoading(true);
    dispatch(getAnswerSheet(selectedCaseId, setLoading)).then(result => {
      if (result?.success && result?.data) {
        console.log("Fetched answer sheet data:", result.data);
        // Normalize legacy single-value data to range format
        const normalized = { ...result.data };
        const formKeys = [
          'MMT_8_initial', 'MMT_8_followUp',
          'CDASI_Activity_initial', 'CDASI_Activity_followUp',
          'CDASI_Damage_initial', 'CDASI_Damage_followUp',
          'Gottron_Hands_initial', 'Gottron_Hands_followUp',
          'Periungual_initial', 'Periungual_followUp',
          'Alopecia_initial', 'Alopecia_followUp',
          'MDAAT_initial', 'MDAAT_followUp',
          'Physician_initial', 'Physician_followUp',
        ];
        formKeys.forEach(key => {
          if (normalized[key] && typeof normalized[key] === 'object') {
            normalized[key] = normalizeScoresToRange(normalized[key]);
          }
        });
        setAnswerData(normalized);
      } else {
        setAnswerData({});
          dispatch(setAlert('Fill the AnswerSheet', 'warning'));
      }
    });
  }
}, [selectedCaseId, dispatch]);


  const handleFormDataChange = (formKey, data) => {
    setAnswerData(prev => ({
      ...prev,
      [formKey]: data
    }));
  };

  const performSubmit = async (payload) => {
    setSaving(true);

    let result;
    if (answerData?.id) {
      result = await dispatch(updateMasterSheet(answerData.id, payload, setSaving));
    } else {
      result = await dispatch(submitAnswerSheet(payload, setSaving));
    }

    setSaving(false);

    if (result?.success) {
      dispatch(
        setAlert(
          answerData?.id ? 'Answer sheet updated successfully' : 'Answer sheet submitted successfully',
          'success'
        )
      );
      setTimeout(() => {
        navigate('/admin/documents');
      }, 1500);
      return true;
    }

    dispatch(setAlert(result?.msg || result?.error || 'Could not submit answer sheet', 'danger'));
    return false;
  };

  const performDelete = async () => {
    if (!answerData?.id) {
      dispatch(setAlert('No answer sheet to delete.', 'warning'));
      return false;
    }

    setConfirmLoading(true);
    const result = await dispatch(deleteAnswerSheet(answerData.id, selectedCaseId));
    setConfirmLoading(false);

    if (result?.success) {
      setAnswerData({});
      dispatch(setAlert('Answer sheet deleted successfully', 'success'));
      setShowConfirm(false);
      return true;
    }

    dispatch(setAlert(result?.msg || result?.error || 'Could not delete answer sheet', 'danger'));
    return false;
  };

  const handleConfirm = async () => {
    if (confirmAction === 'update' || confirmAction === 'create') {
      if (pendingPayload) {
        await performSubmit(pendingPayload);
      }
    } else if (confirmAction === 'delete') {
      await performDelete();
    }

    setConfirmAction('');
    setPendingPayload(null);
    setShowConfirm(false);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setConfirmAction('');
    setPendingPayload(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCaseId) {
      dispatch(setAlert('Please select a case', 'warning'));
      return;
    }

    const isEditMode = Boolean(answerData?.id);

    // Validate range data (min <= max, no partial ranges)
    const formKeys = [
      'MMT_8_initial', 'MMT_8_followUp',
      'CDASI_Activity_initial', 'CDASI_Activity_followUp',
      'CDASI_Damage_initial', 'CDASI_Damage_followUp',
      'Gottron_Hands_initial', 'Gottron_Hands_followUp',
      'Periungual_initial', 'Periungual_followUp',
      'Alopecia_initial', 'Alopecia_followUp',
      'MDAAT_initial', 'MDAAT_followUp',
      'Physician_initial', 'Physician_followUp',
    ];

    let allErrors = [];
    formKeys.forEach(key => {
      if (answerData[key] && typeof answerData[key] === 'object') {
        const errors = validateRangeScores(answerData[key]);
        allErrors = allErrors.concat(errors.map(e => `${key}: ${e}`));
      }
    });

    // ─── VALIDATION: ONLY RUN ON NEW SUBMISSION ───
    if (!isEditMode) {
      // if (allErrors.length > 0) {
      //   dispatch(setAlert(`Range validation errors: ${allErrors[0]}`, 'warning'));
      //   return;
      // }

      // Check empty range inputs and selects
      const firstEmptyField = Array.from(
        document.querySelectorAll('.manual-answer-sheet input[type="number"]:not([disabled])')
      ).find((input) => input.value === '');

      const firstEmptySelect = Array.from(
        document.querySelectorAll('.manual-answer-sheet select:not([disabled])')
      ).find((select) => !select.value || select.value === '');

      const emptyElement = firstEmptyField || firstEmptySelect;

      if (emptyElement) {
        emptyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => emptyElement.focus(), 300);
        dispatch(setAlert('Please fill all required fields before submitting.', 'warning'));
        return;
      }
    }

    const payload = {
      caseId: selectedCaseId,
      answerType: 'manual',
      formData: answerData,
      created_by: user?.id,
    };

    if (isEditMode) {
      setPendingPayload(payload);
      setConfirmAction('update');
      setShowConfirm(true);
      return;
    }

    await performSubmit(payload);
  };

  useEffect(() => {
  dispatch(getAllCases());
}, [dispatch]);

const handleDeleteAnswerSheet = () => {
  if (!answerData?.id) {
    dispatch(setAlert('No answer sheet to delete.', 'warning'));
    return;
  }

  setConfirmAction('delete');
  setShowConfirm(true);
};



  return (
    <div className="manual-answer-sheet">
      <div className="input-wrap mb-4">
        <label className='label'>Select Case:</label>
        <select
          className='input'
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
        >
          <option value="">-- Select a Case --</option>
          {cases.map(caseItem => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCaseId && (
        <>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="forms-container">
                <h5 className="mt-4 mb-3">Initial Visit Forms</h5>
                
                <Form1
                  visit="initial"
                  scores={answerData['MMT_8_initial'] || {}}
                  onChange={(data) => handleFormDataChange('MMT_8_initial', data)}
                />
                
                <Form2
                  visit="initial"
                  scores={answerData['CDASI_Activity_initial'] || {}}
                  onChange={(data) => handleFormDataChange('CDASI_Activity_initial', data)}
                />
                
                <Form3
                  visit="initial"
                  scores={answerData['CDASI_Damage_initial'] || {}}
                  onChange={(data) => handleFormDataChange('CDASI_Damage_initial', data)}
                />
                
                <Form4
                  visit="initial"
                  scores={answerData['Gottron_Hands_initial'] || {}}
                  onChange={(data) => handleFormDataChange('Gottron_Hands_initial', data)}
                />
                
                <Form5
                  visit="initial"
                  scores={answerData['Periungual_initial'] || {}}
                  onChange={(data) => handleFormDataChange('Periungual_initial', data)}
                />
                
                <Form6
                  visit="initial"
                  scores={answerData['Alopecia_initial'] || {}}
                  onChange={(data) => handleFormDataChange('Alopecia_initial', data)}
                />
                
                <Form7
                  visit="initial"
                  scores={answerData['MDAAT_initial'] || {}}
                  onChange={(data) => handleFormDataChange('MDAAT_initial', data)}
                />
                
                <Form9
                  visit="initial"
                  scores={answerData['Physician_initial'] || {}}
                  onChange={(data) => handleFormDataChange('Physician_initial', data)}
                />

                <h5 className="mt-5 mb-3">Follow-Up Visit Forms</h5>
                
                <Form1
                  visit="followUp"
                  scores={answerData['MMT_8_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('MMT_8_followUp', data)}
                />
                
                <Form2
                  visit="followUp"
                  scores={answerData['CDASI_Activity_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('CDASI_Activity_followUp', data)}
                />
                
                <Form3
                  visit="followUp"
                  scores={answerData['CDASI_Damage_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('CDASI_Damage_followUp', data)}
                />
                
                <Form4
                  visit="followUp"
                  scores={answerData['Gottron_Hands_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('Gottron_Hands_followUp', data)}
                />
                
                <Form5
                  visit="followUp"
                  scores={answerData['Periungual_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('Periungual_followUp', data)}
                />
                
                <Form6
                  visit="followUp"
                  scores={answerData['Alopecia_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('Alopecia_followUp', data)}
                />
                
                <Form7
                  visit="followUp"
                  scores={answerData['MDAAT_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('MDAAT_followUp', data)}
                />
                
                <Form9
                  visit="followUp"
                  scores={answerData['Physician_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('Physician_followUp', data)}
                />
              </div>

              <div className="text-end mt-4">
                <button
                  type="submit"
                  className='site-link'
                  disabled={saving}
                >
                  <span>
                    {saving && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    )}
                    {/* {saving ? 'Saving...' : 'Submit Answer Sheet'} */}
                    {saving
  ? (isEditMode ? 'Updating...' : 'Saving...')
  : (isEditMode ? 'Update Answer Sheet' : 'Submit Answer Sheet')
}

                  </span>
                </button>


              {answerData?.id && (
  <div className="text-end mt-2">
    <button
      type="button"
      className="btn btn-danger"
      onClick={handleDeleteAnswerSheet}
    >
      Delete Answer Sheet
    </button>
  </div>
)}


              </div>
            </form>
          )}
        </>
      )}

      <CommonAlert
        show={showConfirm}
        handleClose={handleCloseConfirm}
        handleConfirm={handleConfirm}
        message={
          confirmAction === 'delete'
            ? 'Are you sure you want to delete this answer sheet?'
            : 'Are you sure you want to update this answer sheet?'
        }
        cancelButton="Cancel"
        confirmButton={confirmLoading ? 'Processing...' : confirmAction === 'delete' ? 'Delete' : 'Confirm'}
      />
    </div>
  );
};

export default ManualAnswerSheet;