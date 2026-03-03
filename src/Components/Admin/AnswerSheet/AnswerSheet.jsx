import React, { useState } from 'react';
import MainWrapper from '../../../CommonComponents/MainWrapper';
import { MdFormatAlignRight } from 'react-icons/md';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import ManualAnswerSheet from './ManualAnswerSheet';
import UploadAnswerSheet from './UploadAnswerSheet';

export const AnswerSheet = () => {
  const [isUploadMode, setIsUploadMode] = useState(false);

  return (
    <MainWrapper>
      <div className="title-header mt-3">
        <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
          <div className='d-flex align-items-center gap-2'>
            <MdFormatAlignRight fontSize={24} />
            <h3>Answer Sheet Management</h3>
          </div>
          
          <div className='d-flex align-items-center gap-3'>
            <span style={{ fontWeight: '500' }}>
              {isUploadMode ? 'Upload Mode' : 'Manual Mode'}
            </span>
            <button
              className='btn btn-link p-0'
              onClick={() => setIsUploadMode(!isUploadMode)}
              style={{ fontSize: '2rem', color: 'var(--primary-color)' }}
            >
              {isUploadMode ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>
        </div>
      </div>

      <div className="theme-card mt-3">
        {isUploadMode ? (
          <UploadAnswerSheet />
        ) : (
          <ManualAnswerSheet />
        )}
      </div>
    </MainWrapper>
  );
};