import React, { useState } from 'react'
import MainWrapper from '../../CommonComponents/MainWrapper'
import { Header } from '../../CommonComponents/Header'
import { RiUploadCloud2Line } from 'react-icons/ri'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { submitCaseForm } from '../../Redux/Actions/CaseAction';
//import { uploadCaseFile } from '../../Redux/Actions/CaseAction'
import { setAlert } from '../../Redux/Actions/AlertActions'
export const UploadCase = () => {


  const [formData, setFormData] = useState({

    title: '',
    file: null,

  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
      return;
    }

    if (name === "title") {

      value = value.replace(/\s+/g, " ");

      value = value.replace(/([A-Za-z])(\d)/g, "$1 $2");

      value = value.replace(/(\d)\s+$/, "$1");

      value = value.charAt(0).toUpperCase() + value.slice(1);

      setFormData({ ...formData, title: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) {
      dispatch(setAlert("Please upload a file first.", "danger"));
      return;
    }
    if (!formData.title) {
      dispatch(setAlert("Please upload a file first.", "danger"));
      return;
    }

    const data = new FormData()
    data.append('file', formData.file)
    // data.append('caseNo', formData.caseNo)
    data.append('title', formData.title)


    dispatch(submitCaseForm(data, setLoading, () => {
      navigate('/admin/documents');
    }));

  };

  return (
    <>
      <MainWrapper>
        <div className="title-header mt-3">
          <div className='d-flex align-items-center justify-content-between'>
            <h3>Upload Document</h3>
          </div>
        </div>
        <div className="theme-card mt-3">
          <form onSubmit={handleSubmit}>
            {/* <div className="input-wrap">
            <label className='label'>Case No:</label>
            <input type="number" name="caseNo" value={formData.caseNo}
              onChange={handleChange} className='input' />
          </div> */}
            <div className="input-wrap">
              <label className='label'>Title:</label>
              <input type="text" name="title" value={formData.title}
                onChange={handleChange} className='input' />
            </div>
            <div className="input-wrap mt-3">
              <label className='label'>File:</label>
              <div className="uploadBox">
                <div className="uploadBox-in">
                  <RiUploadCloud2Line />
                  <p>Upload File</p>
                  <input type="file" name="file"
                    onChange={handleChange} accept=".pdf,.docx" className='file-input' />
                  {/* <span>Uploaded File Name</span> */}
                  <span>{formData.file ? formData.file.name : "No file selected"}</span>

                </div>
              </div>
            </div>
            <div className='text-end mt-3' disabled={loading}>
              <button className='site-link' ><span> Submit{loading ? <i className="fa fa-spinner fa-spin mx-1" /> : ""}</span></button>

            </div>
          </form>
        </div>
      </MainWrapper>
    </>
  )
}

