import { Modal } from 'react-bootstrap'
import { CgClose } from 'react-icons/cg'
import { FaSpinner } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa6'

const CommonAlert = (props) => {
    return (
        <Modal className="VideoModal sm-modal" show={props.show} backdrop="static" centered>
            <span className='modalClose' onClick={props.handleClose}><CgClose /></span>
            <Modal.Body>
                <div className="text-center">
                    <div className="modalIcon"><FaTrash /></div>
                </div>
                <p className="pt-4 text-center text-white">{props.message}</p>
                <div className='btnGroup mt-4 mb-4 text-center'>
                    <button className="site-link dark border-btn" onClick={props.handleClose}>
                        <span>{props.cancelButton}</span>
                    </button>

                    <button
                        className="site-link red"
                        onClick={props.handleConfirm}
                        disabled={props.confirmButton?.type === 'object'}
                    >
                        <span>{props.confirmButton}</span>
                    </button>

                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CommonAlert