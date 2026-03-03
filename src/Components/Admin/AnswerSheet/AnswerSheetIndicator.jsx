import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdUploadFile } from 'react-icons/md';
import { AiOutlineFileText } from 'react-icons/ai';

const AnswerSheetIndicator = ({ hasAnswerSheet, answerSheetType, showType = true }) => {
  if (!hasAnswerSheet) {
    return (
      <span className="badge red d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
        <FaTimesCircle fontSize={12} />
        Not Present
      </span>
    );
  }

  const isManual = answerSheetType === 'manual';
  
  return (
    <span className="badge green d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
      <FaCheckCircle fontSize={12} />
      Present
      {showType && (
        <>
          {' '}
          {isManual ? (
            <AiOutlineFileText fontSize={14} title="Manual Entry" />
          ) : (
            <MdUploadFile fontSize={14} title="Uploaded File" />
          )}
        </>
      )}
    </span>
  );
};

export default AnswerSheetIndicator;