import { useMemo, useState, useEffect } from "react";
import { isRangeValue } from "./rangeUtils";

export default function Form9({
  visit = "initial",
  readOnly = false,
  FORM_COUNT = 1,
  scores = {},
  onChange,
}) {
  const fieldName = "physicianGlobal.vas";

  const val = scores[fieldName];
  let minVal = 0;
  let maxVal = 0;
  let isFieldEmpty = true;

  if (isRangeValue(val)) {
    minVal = Number(val.min) || 0;
    maxVal = Number(val.max) || 0;
    isFieldEmpty = false;
  } else if (val !== undefined && val !== null && val !== "") {
    minVal = Number(val) || 0;
    maxVal = Number(val) || 0;
    isFieldEmpty = false;
  }

  const [localMin, setLocalMin] = useState(minVal);
  const [localMax, setLocalMax] = useState(maxVal);

  useEffect(() => {
    setLocalMin(minVal);
    setLocalMax(maxVal);
  }, [minVal, maxVal]);

  const handleMinChange = (newMin) => {
    setLocalMin(newMin);
  };

  const handleMaxChange = (newMax) => {
    setLocalMax(newMax);
  };

  const commitMinChange = () => {
    const currentMax = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].max) || 0 : maxVal;
    onChange({
      ...scores,
      [fieldName]: { min: localMin, max: Math.max(localMin, currentMax) },
    });
  };

  const commitMaxChange = () => {
    const currentMin = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].min) || 0 : minVal;
    onChange({
      ...scores,
      [fieldName]: { min: Math.min(currentMin, localMax), max: localMax },
    });
  };

  const percentFilled = useMemo(() => {
    return !isFieldEmpty ? 100 / FORM_COUNT : 0;
  }, [isFieldEmpty, FORM_COUNT]);

  const isInitial = visit === "initial";

  return (
    <div className="form-section-wrap table-container text-center mt-4">
      {isInitial ? (
        <h5>Case Presentation: Initial</h5>
      ) : (
        <h5>Case Presentation: Follow up</h5>
      )}

      <h5>Physician Global Disease Activity</h5>
      <strong className="text-dark">
        Please rate patient's global (overall) disease activity
      </strong>

      <div className="slider-section text-center mt-3 px-3" id={`${visit}_${fieldName}`}>
        <div>
          Selected Range: <strong>{isFieldEmpty ? "-" : `${localMin} – ${localMax}`}</strong>
        </div>

        {/* Min Slider */}
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Min: {localMin}</span>
          <div style={{ position: "relative", margin: "6px 0" }}>
            <div style={{
              height: 6,
              background: "rgb(187 187 187)",
              borderRadius: 3,
              position: "relative",
            }}>
              <div style={{
                width: `${localMin * 10}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: 3,
                transition: "width 0.1s ease",
              }} />
              <div style={{
                position: "absolute",
                left: `${localMin * 10}%`,
                top: -7,
                transform: "translateX(-50%)",
                transition: "left 0.1s ease",
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  background: "#3b82f6",
                  borderRadius: "50%",
                  border: "2px solid white",
                }} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={localMin}
              disabled={readOnly}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              onMouseUp={commitMinChange}
              onTouchEnd={commitMinChange}
              onKeyUp={commitMinChange}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 20,
                opacity: 0,
                cursor: readOnly ? "default" : "pointer",
              }}
            />
          </div>
        </div>

        {/* Max Slider */}
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Max: {localMax}</span>
          <div style={{ position: "relative", margin: "6px 0" }}>
            <div style={{
              height: 6,
              background: "rgb(187 187 187)",
              borderRadius: 3,
              position: "relative",
            }}>
              <div style={{
                width: `${localMax * 10}%`,
                height: "100%",
                background: "var(--button-1)",
                borderRadius: 3,
                transition: "width 0.1s ease",
              }} />
              <div style={{
                position: "absolute",
                left: `${localMax * 10}%`,
                top: -7,
                transform: "translateX(-50%)",
                transition: "left 0.1s ease",
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  background: "var(--button-1)",
                  borderRadius: "50%",
                  border: "2px solid white",
                }} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={localMax}
              disabled={readOnly}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              onMouseUp={commitMaxChange}
              onTouchEnd={commitMaxChange}
              onKeyUp={commitMaxChange}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 20,
                opacity: 0,
                cursor: readOnly ? "default" : "pointer",
              }}
            />
          </div>
        </div>

        {/* Expert Number Input */}
        <div style={{ marginTop: 24, textAlign: "left" }}>
          <label style={{ fontSize: 13, fontWeight: "bold", marginRight: 10 }}>
            Expert Number:
          </label>
          <input
            type="text"
            className="input sm light px-2"
            style={{ width: 150 }}
            value={scores[fieldName]?.expertNumber || ""}
            onChange={(e) => {
              const currentMin = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].min) || 0 : minVal;
              const currentMax = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].max) || 0 : maxVal;
              onChange({
                ...scores,
                [fieldName]: {
                  min: currentMin,
                  max: currentMax,
                  expertNumber: e.target.value
                }
              });
            }}
            disabled={readOnly}
            placeholder="Enter Expert No."
          />
        </div>
      </div>
    </div>
  );
}
