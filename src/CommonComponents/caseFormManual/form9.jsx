import { useMemo } from "react";
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

  const handleMinChange = (newMin) => {
    const currentMax = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].max) || 0 : maxVal;
    onChange({
      ...scores,
      [fieldName]: { min: newMin, max: Math.max(newMin, currentMax) },
    });
  };

  const handleMaxChange = (newMax) => {
    const currentMin = isRangeValue(scores[fieldName]) ? Number(scores[fieldName].min) || 0 : minVal;
    onChange({
      ...scores,
      [fieldName]: { min: Math.min(currentMin, newMax), max: newMax },
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

      <div className="slider-section text-center mt-3 px-3">
        <div>
          Selected Range: <strong>{isFieldEmpty ? "-" : `${minVal} – ${maxVal}`}</strong>
        </div>

        {/* Min Slider */}
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Min: {minVal}</span>
          <div style={{ position: "relative", margin: "6px 0" }}>
            <div style={{
              height: 6,
              background: "rgb(187 187 187)",
              borderRadius: 3,
              position: "relative",
            }}>
              <div style={{
                width: `${minVal * 10}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: 3,
                transition: "width 0.2s ease",
              }} />
              <div style={{
                position: "absolute",
                left: `${minVal * 10}%`,
                top: -7,
                transform: "translateX(-50%)",
                transition: "left 0.2s ease",
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
              value={minVal}
              disabled={readOnly}
              onChange={(e) => handleMinChange(Number(e.target.value))}
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
          <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Max: {maxVal}</span>
          <div style={{ position: "relative", margin: "6px 0" }}>
            <div style={{
              height: 6,
              background: "rgb(187 187 187)",
              borderRadius: 3,
              position: "relative",
            }}>
              <div style={{
                width: `${maxVal * 10}%`,
                height: "100%",
                background: "var(--button-1)",
                borderRadius: 3,
                transition: "width 0.2s ease",
              }} />
              <div style={{
                position: "absolute",
                left: `${maxVal * 10}%`,
                top: -7,
                transform: "translateX(-50%)",
                transition: "left 0.2s ease",
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
              value={maxVal}
              disabled={readOnly}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
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
      </div>
    </div>
  );
}
