import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { CgClose } from 'react-icons/cg'


export const CreateFaqModal = ({ show, handleClose, handleSubmit }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const [loader, setLoader] = useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const success = await handleSubmit(formData, setLoader);
    setLoader(false)
    if (success) {
      setFormData({ question: '', answer: '' });
    }
  };

  return (
    <Modal className="VideoModal modal-750 faqModal" show={show} backdrop="static" centered>
      <span className='modalClose' onClick={handleClose}><CgClose /></span>
      <Modal.Body>
        <h4>Add FAQ (Frequently Asked Questions)</h4>
        <form onSubmit={onSubmit}>
          <div className="input-wrap mt-3"><label className="label">Question:</label><input className="input" type="text" name="question" value={formData.question}
            onChange={handleChange}
            required /></div>
          <div className="input-wrap mt-3">
            <label className="label">Answer:
            </label>
            <textarea name="answer" id="" className='input' value={formData.answer}
              onChange={handleChange}
              required></textarea>
          </div>
          <div className="mt-4 text-end">
            <button type="submit" className="site-link blue" disabled={loader}>
              <span>
                {loader && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                Add FAQ
              </span>
            </button>
          </div>

        </form>
      </Modal.Body>
    </Modal>
  )
}
