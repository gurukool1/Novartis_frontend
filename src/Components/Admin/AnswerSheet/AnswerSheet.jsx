import React, { useState } from 'react';
import MainWrapper from '../../../CommonComponents/MainWrapper';
import { MdFormatAlignRight, MdEditNote, MdCloudUpload } from 'react-icons/md';
import ManualAnswerSheet from './ManualAnswerSheet';
import UploadAnswerSheet from './UploadAnswerSheet';

export const AnswerSheet = () => {
  const [isUploadMode, setIsUploadMode] = useState(false);

  return (
    <MainWrapper>
      <div className="title-header mt-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

          {/* Page title */}
          <div className="d-flex align-items-center gap-2">
            <MdFormatAlignRight fontSize={24} />
            <h3 className="mb-0">Answer Sheet Management</h3>
          </div>

          {/* ── Segmented pill toggle ── */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 50,
              padding: "4px",
              gap: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              backgroundColor: "#f1afafff",
            }}
          >
            {/* Manual tab */}
            <button
              onClick={() => setIsUploadMode(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 20px",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: "#f1afafff",
                fontSize: 13,
                transition: "all 0.22s ease",
                background: !isUploadMode
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : "transparent",
                color: !isUploadMode ? "#f1afafff" : "rgba(255,255,255,0.55)",
                boxShadow: !isUploadMode
                  ? "0 2px 10px rgba(104, 146, 238, 0.45)"
                  : "none",
              }}
            >
              <MdEditNote size={16} />
              Manual
            </button>

            {/* Upload tab */}
            <button
              onClick={() => setIsUploadMode(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 20px",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                backgroundColor: "#f1afafff",
                transition: "all 0.22s ease",
                background: isUploadMode
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : "transparent",
                color: isUploadMode ? "#f1afafff" : "rgba(255,255,255,0.55)",
                boxShadow: isUploadMode
                  ? "0 2px 10px rgba(37,99,235,0.45)"
                  : "none",
              }}
            >
              <MdCloudUpload size={16} />
              Upload
            </button>
          </div>

        </div>
      </div>

      <div className="theme-card mt-3">
        {isUploadMode ? <UploadAnswerSheet /> : <ManualAnswerSheet />}
      </div>
    </MainWrapper>
  );
};