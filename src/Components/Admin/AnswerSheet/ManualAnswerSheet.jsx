import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitAnswerSheet, getAnswerSheet, updateMasterSheet, deleteAnswerSheet } from '../../../Redux/Actions/AnswerSheetAction';
import { getAllCases } from '../../../Redux/Actions/CaseAction';
import { setAlert } from '../../../Redux/Actions/AlertActions';
import CommonAlert from '../../../CommonComponents/CommonAlert';
import { normalizeScoresToRange, transformPayload, validateRequiredFields, computeRangeTotal, isRangeValue } from '../../../CommonComponents/caseFormManual/rangeUtils';
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


 if (normalized.form_Score_initial) {
      normalized.grandTotal_initial = normalized.form_Score_initial;
    }

    if (normalized.form_Score_followUp) {
      normalized.grandTotal_followUp = normalized.form_Score_followUp;
    }

        const formKeys = [
          'MMT_8_initial',
          'CDASI_Activity_initial',
          'CDASI_Damage_initial',
          'Gottron_Hands_initial',
          'Periungual_initial',
          'Alopecia_initial',
          'grandTotal_initial',
          'MDAAT_initial',
          'Physician_initial',
          'MMT_8_followUp',
          'CDASI_Activity_followUp',
          'CDASI_Damage_followUp',
          'Gottron_Hands_followUp',
          'Periungual_followUp',
          'Alopecia_followUp',
          'grandTotal_followUp',
          'MDAAT_followUp',
          'Physician_followUp',
        ];
        formKeys.forEach(key => {
          if ( normalized[key] && typeof normalized[key] === 'object') {
            normalized[key] = normalizeScoresToRange(normalized[key]);
          }
        });
       // setAnswerData(normalized);
        setAnswerData(prev => ({
  ...prev,
  ...normalized
}));
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
      'MMT_8_initial',
      'CDASI_Activity_initial',
      'CDASI_Damage_initial',
      'Gottron_Hands_initial',
      'Periungual_initial',
      'Alopecia_initial',
      'grandTotal_initial',
      'MDAAT_initial',
      'Physician_initial',
      'MMT_8_followUp',
      'CDASI_Activity_followUp',
      'CDASI_Damage_followUp',
      'Gottron_Hands_followUp',
      'Periungual_followUp',
      'Alopecia_followUp',
      'grandTotal_followUp',
      'MDAAT_followUp',
      'Physician_followUp',
    ];

 



if (!isEditMode) {

  let requiredErrors = [];

  formKeys.forEach(key => {

    if (key.startsWith('grandTotal_')) {
      const gt = answerData[key] || {};
      if (!gt.activitymin) requiredErrors.push(`${key}: activitymin: Required`);
      else if (!gt.activitymax) requiredErrors.push(`${key}: activitymax: Required`);
      
      if (!gt.damagemin) requiredErrors.push(`${key}: damagemin: Required`);
      else if (!gt.damagemax) requiredErrors.push(`${key}: damagemax: Required`);
      return;
    }

    if (typeof answerData[key] === 'object' || !answerData[key]) {
      const errors = validateRequiredFields(answerData[key] || {}, key);
      requiredErrors = requiredErrors.concat(errors.map(e => `${key}: ${e}`));
    }
  });

  if (requiredErrors.length > 0) {
    dispatch(setAlert('All fields are required', 'warning'));
    
    // Sort errors so that initial sections take priority over follow-up sections
    // This correctly identifies the visual section order even if formKeys are interleaved.
    const sortedErrors = [...requiredErrors].sort((a, b) => {
      const aIsInitial = a.includes('_initial');
      const bIsInitial = b.includes('_initial');
      if (aIsInitial && !bIsInitial) return -1;
      if (!aIsInitial && bIsInitial) return 1;
      return 0;
    });

    // Auto-scroll to the first validation error
    const firstError = sortedErrors[0];
    let elementId = null;

    if (firstError.includes(': missing')) {
      elementId = firstError.split(':')[0]; // e.g., "MMT_8_initial"
    } else {
      const match = firstError.match(/^([a-zA-Z0-9_]+_(?:initial|followUp)):\s*(.+?):\s*Required$/);
      if (match) {
        const formKey = match[1];
        const fieldKey = match[2];
        const visitMatch = formKey.match(/_(initial|followUp)$/);
        if (visitMatch) {
          const visit = visitMatch[1];
          elementId = `${visit}_${fieldKey}`; // e.g., "initial_Scalp.erythema"
        }
      }
    }

    if (elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto focus the input directly
        const focusable = (el.tagName === 'INPUT' || el.tagName === 'SELECT') ? el : el.querySelector('input, select');
        if (focusable) {
          focusable.focus();
        }
        
        // Highlight the element itself
        const highlightEl = el.querySelector('.panel') || el;
        highlightEl.style.transition = 'box-shadow 0.3s';
        highlightEl.style.boxShadow = '0 0 12px 3px red';
        setTimeout(() => {
          highlightEl.style.boxShadow = 'none';
        }, 2000);
      }
    }

    return;
  }
}


    // const transformedData = {};
    // const grandTotal = {};

    // Object.keys(answerData).forEach((key) => {
    //   if (key === 'grandTotal_initial') {
    //     grandTotal.initial = answerData[key];
    //   } else if (key === 'grandTotal_followUp') {
    //     grandTotal.followUp = answerData[key];
    //   } else {
    //     if (typeof answerData[key] === "object") {
    //       transformedData[key] = transformPayload(answerData[key]);
    //     } else {
    //       transformedData[key] = answerData[key];
    //     }
    //   }
    // });


   const transformedData = {};

Object.keys(answerData).forEach((key) => {

  // ✅ GRAND TOTAL INITIAL
  if (key === "grandTotal_initial") {

    transformedData["form_Score_initial"] = {
      activitymin: Number(answerData[key]?.activitymin) || null,
      activitymax: Number(answerData[key]?.activitymax) || null,
      damagemin: Number(answerData[key]?.damagemin) || null,
      damagemax: Number(answerData[key]?.damagemax)  || null,
    };

    return;
  }

  // ✅ GRAND TOTAL FOLLOWUP
  if (key === "grandTotal_followUp") {

    transformedData["form_Score_followUp"] = {
      activitymin: Number(answerData[key]?.activitymin) || null,
      activitymax: Number(answerData[key]?.activitymax) || null,
      damagemin: Number(answerData[key]?.damagemin) || null,
      damagemax: Number(answerData[key]?.damagemax) || null,
    };

    return;
  }

  // ✅ NORMAL FORMS
  if (typeof answerData[key] === "object") {
    transformedData[key] = transformPayload(answerData[key]);
  } else {
    transformedData[key] = answerData[key];
  }
});



//console.log(transformedData, "TRANSFORMED DATA IN COMPONENT");
   // console.log(grandTotal, "GRAND TOTAL IN COMPONENT");
    const payload = {
      caseId: selectedCaseId,
      answerType: 'manual',
      formData: transformedData,
     // grandTotal: grandTotal,
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

// console.log(grandTotal, "GRAND TOTAL IN COMPONENT");

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
                
                <div id="MMT_8_initial">
                  <Form1
                    visit="initial"
                    scores={answerData['MMT_8_initial'] || {}}
                    onChange={(data) => handleFormDataChange('MMT_8_initial', data)}
                  />
                </div>
                
                <div id="CDASI_Activity_initial">
                  <Form2
                    visit="initial"
                    scores={answerData['CDASI_Activity_initial'] || {}}
                    onChange={(data) => handleFormDataChange('CDASI_Activity_initial', data)}
                  />
                </div>
                
                <div id="CDASI_Damage_initial">
                  <Form3
                    visit="initial"
                    scores={answerData['CDASI_Damage_initial'] || {}}
                    onChange={(data) => handleFormDataChange('CDASI_Damage_initial', data)}
                  />
                </div>
                
                <div id="Gottron_Hands_initial">
                  <Form4
                    visit="initial"
                    scores={answerData['Gottron_Hands_initial'] || {}}
                    onChange={(data) => handleFormDataChange('Gottron_Hands_initial', data)}
                  />
                </div>
                
                <div id="Periungual_initial">
                  <Form5
                    visit="initial"
                    scores={answerData['Periungual_initial'] || {}}
                    onChange={(data) => handleFormDataChange('Periungual_initial', data)}
                  />
                </div>
                
                <div id="Alopecia_initial">
                  <Form6
                    visit="initial"
                    scores={answerData['Alopecia_initial'] || {}}
                    onChange={(data) => handleFormDataChange('Alopecia_initial', data)}
                  />
                </div>
                <Form8
                  visit="initial"
                  scores={answerData['grandTotal_initial'] || {}}
                  onChange={(data) => handleFormDataChange('grandTotal_initial', data)}
                />
                <div id="MDAAT_initial">
                  <Form7
                    visit="initial"
                    scores={answerData['MDAAT_initial'] || {}}
                    onChange={(data) => handleFormDataChange('MDAAT_initial', data)}
                  />
                </div>
                
                {/* <Form8
                  activityTotal={calculateActivityTotal('initial')}
                  damageTotal={calculateDamageTotal('initial')}
                /> */}
                
                <div id="Physician_initial">
                  <Form9
                    visit="initial"
                    scores={answerData['Physician_initial'] || {}}
                    onChange={(data) => handleFormDataChange('Physician_initial', data)}
                  />
                </div>

                <h5 className="mt-5 mb-3">Follow-Up Visit Forms</h5>
                
                <div id="MMT_8_followUp">
                  <Form1
                    visit="followUp"
                    scores={answerData['MMT_8_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('MMT_8_followUp', data)}
                  />
                </div>
                
                <div id="CDASI_Activity_followUp">
                  <Form2
                    visit="followUp"
                    scores={answerData['CDASI_Activity_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('CDASI_Activity_followUp', data)}
                  />
                </div>
                
                <div id="CDASI_Damage_followUp">
                  <Form3
                    visit="followUp"
                    scores={answerData['CDASI_Damage_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('CDASI_Damage_followUp', data)}
                  />
                </div>
                
                <div id="Gottron_Hands_followUp">
                  <Form4
                    visit="followUp"
                    scores={answerData['Gottron_Hands_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('Gottron_Hands_followUp', data)}
                  />
                </div>
                
                <div id="Periungual_followUp">
                  <Form5
                    visit="followUp"
                    scores={answerData['Periungual_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('Periungual_followUp', data)}
                  />
                </div>
                
                <div id="Alopecia_followUp">
                  <Form6
                    visit="followUp"
                    scores={answerData['Alopecia_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('Alopecia_followUp', data)}
                  />
                </div>
                <Form8
                  visit="followUp"
                  scores={answerData['grandTotal_followUp'] || {}}
                  onChange={(data) => handleFormDataChange('grandTotal_followUp', data)}
                />
                <div id="MDAAT_followUp">
                  <Form7
                    visit="followUp"
                    scores={answerData['MDAAT_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('MDAAT_followUp', data)}
                  />
                </div>

                {/* <Form8
                  activityTotal={calculateActivityTotal('followUp')}
                  damageTotal={calculateDamageTotal('followUp')}
                /> */}
                
                <div id="Physician_followUp">
                  <Form9
                    visit="followUp"
                    scores={answerData['Physician_followUp'] || {}}
                    onChange={(data) => handleFormDataChange('Physician_followUp', data)}
                  />
                </div>
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