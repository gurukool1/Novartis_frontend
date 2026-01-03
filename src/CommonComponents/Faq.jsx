import React, { useState, useEffect } from 'react';
import MainWrapper from './MainWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from 'react-bootstrap';
import { CreateFaqModal } from './CreateFaqModal';
import { EditFaqModal } from './EditFaqModal';
import CommonAlert from "../CommonComponents/CommonAlert";
import { getFaqs, addFaq, updateFaq, deleteFaq } from '../Redux/Actions/FaqAction';
import { FaTrash } from 'react-icons/fa6';
import { MdEditSquare } from 'react-icons/md';
export const Faq = () => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const { faqs, loading } = useSelector(state => state.faqs);
    const [currentFaq, setCurrentFaq] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const { user } = useSelector(state => state.auth);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState(null);

    const isAdmin = user?.role === 'admin';
    const handleshow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };


    const handleEditShow = (faq) => {
        setCurrentFaq(faq);
        setShowEditModal(true);
    };
    const handleEditClose = () => {
        setCurrentFaq(null);
        setShowEditModal(false);
    };




    const handleAddFaq = async (faqData) => {
        const newFaq = await dispatch(addFaq(faqData));
        if (newFaq) {
            setShow(false);
            return true;
        }
        return false;
    };


    const handleUpdateFaq = async (faqData) => {
        if (!currentFaq) return false;
        const success = await dispatch(updateFaq(currentFaq.id, faqData));
        if (success) {
            setShowEditModal(false);
            setCurrentFaq(null);
        }
        return success;
    };

    // Handle delete FAQ
    // const handleDeleteFaq = (faqId) => {
    //     if (window.confirm('Are you sure you want to delete this FAQ?')) {
    //         dispatch(deleteFaq(faqId));
    //     }
    // };


    const handleDeleteFaq = (faqId) => {
        setSelectedFaqId(faqId);
        setShowDeleteAlert(true);
    };

    const confirmDeleteFaq = () => {
        if (selectedFaqId) {
            dispatch(deleteFaq(selectedFaqId));
            setSelectedFaqId(null);
        }
        setShowDeleteAlert(false);
    };


    useEffect(() => {
        dispatch(getFaqs());
    }, [dispatch]);

    return (
        <MainWrapper>
            <div className="title-header mt-3">
                <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
                    <h3>FAQ (Frequently Asked Questions)</h3>
                    {isAdmin && (
                        <div className="d-flex gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <button className="site-link" onClick={handleshow}>
                                    <span>Create FAQ</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 faq-accordian">
                {/* {loading ? (
                    <p>Loading FAQs...</p>
                ) :  */}

                {loading ? (
                    <div className='d-flex align-items-center justify-content-center mt-3'>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    // <tr>
                    //     <td colSpan="5" className="text-center py-5">
                    //     </td>
                    // </tr>
                ) :
                    faqs.length > 0 ? (
                        <Accordion defaultActiveKey="0" flush>
                            {faqs.map((faq, index) => (
                                <Accordion.Item key={faq.id} className="mb-3" eventKey={String(index)}>
                                    <Accordion.Header>{faq.question}</Accordion.Header>
                                    <Accordion.Body>
                                        {faq.answer}
                                        {isAdmin && (
                                            <div className="d-flex justify-content-end gap-2 mt-3">
                                                <span
                                                    className="badge blue"
                                                    onClick={() => handleEditShow(faq)}
                                                >
                                                    <MdEditSquare fontSize={12} />
                                                </span>
                                                <span
                                                    className="badge red"
                                                    onClick={() => handleDeleteFaq(faq.id)}
                                                >
                                                    <FaTrash fontSize={12} />
                                                </span>
                                            </div>
                                        )}

                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    ) : (
                        <h6 className='text-center mt-3'>No FAQs available.</h6>
                    )}
            </div>
            {isAdmin && (
                <CreateFaqModal
                    show={show}
                    handleClose={handleClose}
                    handleSubmit={handleAddFaq}
                />
            )}


            {isAdmin && currentFaq && (
                <EditFaqModal
                    show={showEditModal}
                    handleClose={handleEditClose}
                    handleSubmit={handleUpdateFaq}
                    currentFaq={currentFaq}
                />
            )}
            <CommonAlert
                show={showDeleteAlert}
                handleClose={() => setShowDeleteAlert(false)}
                handleConfirm={confirmDeleteFaq}
                message={"Are you sure you want to delete this FAQ?"}
                confirmButton={"Delete"}
                cancelButton={"Cancel"}
            />

        </MainWrapper>
    );
};
