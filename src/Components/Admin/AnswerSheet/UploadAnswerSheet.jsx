import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { uploadAnswerSheetFile } from '../../../Redux/Actions/AnswerSheetAction';
import { getAllCases } from '../../../Redux/Actions/CaseAction';
import { setAlert } from '../../../Redux/Actions/AlertActions';
import { useNavigate } from 'react-router-dom';
const UploadAnswerSheet = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { cases } = useSelector(state => state.case);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getAllCases());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
         'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
     if (!validTypes.includes(selectedFile.type)) {
      dispatch(setAlert('Please upload a valid file (PDF or DOCX only)', 'danger'));
      return;
    }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCaseId) {
      dispatch(setAlert('Please select a case', 'warning'));
      return;
    }
    
    if (!file) {
      dispatch(setAlert('Please select a file to upload', 'warning'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', selectedCaseId);
    formData.append('answerType', 'upload');

    const result = await dispatch(uploadAnswerSheetFile(formData, setUploading));
    
    if (result?.success) {
      setFile(null);
      setSelectedCaseId('');
     setTimeout(() => {
        navigate('/admin/documents');
      }, 1500);
    }
  };

  return (
    <div className="upload-answer-sheet">
      <form onSubmit={handleSubmit}>
        <div className="input-wrap mb-4">
          <label className='label'>Select Case:</label>
          <select
            className='input'
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            required
          >
            <option value="">-- Select a Case --</option>
            {cases.map(caseItem => (
              <option key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </option>
            ))}
          </select>
        </div>

        <div className="input-wrap mt-3">
          <label className='label'>Upload Answer Sheet:</label>
          <div className="uploadBox">
            <div className="uploadBox-in">
              <RiUploadCloud2Line />
              <p>Upload File (PDF or DOCX)</p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className='file-input'
              />
              <span>{file ? file.name : "No file selected"}</span>
            </div>
          </div>
          <small className="form-text text-muted mt-2">
            Accepted formats: PDF (.pdf), DOCX (.docx)
          </small>
        </div>

        <div className="text-end mt-4">
          <button
            type="submit"
            className='site-link'
            disabled={uploading}
          >
            <span>
              {uploading && (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              )}
              {uploading ? 'Uploading...' : 'Upload Answer Sheet'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadAnswerSheet;