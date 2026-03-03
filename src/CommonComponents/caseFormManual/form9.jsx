import { useMemo } from "react";

export default function Form9({
  visit = "initial",
  readOnly = false,
  FORM_COUNT = 1,
  scores = {},
  onChange,
}) {
  const fieldName = "physicianGlobal.vas";

  const value =
    scores[fieldName] === undefined ||
    scores[fieldName] === null ||
    scores[fieldName] === ""
      ? 0
      : Number(scores[fieldName]);

  const isFieldEmpty =
    scores[fieldName] === undefined ||
    scores[fieldName] === null ||
    scores[fieldName] === "";

  const handleChange = (val) => {
    onChange({
      ...scores,
      [fieldName]: Number(val),
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
          Selected Value: <strong>{isFieldEmpty ? "-" : value}</strong>
        </div>

        <div style={{ position: "relative", margin: "20px 0" }}>
          {/* Track */}
          <div
            style={{
              height: 6,
              background: "rgb(187 187 187)",
              borderRadius: 3,
              position: "relative",
            }}
          >
            {/* Filled Bar */}
            <div
              style={{
                width: `${value * 10}%`,
                height: "100%",
                background: "var(--button-1)",
                borderRadius: 3,
                transition: "width 0.2s ease",
              }}
            />

            {/* Thumb */}
            <div
              style={{
                position: "absolute",
                left: `${value * 10}%`,
                top: -7,
                transform: "translateX(-50%)",
                transition: "left 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "var(--button-1)",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            </div>
          </div>

          {/* Invisible range input */}
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={value}
            disabled={readOnly}
            onChange={(e) => handleChange(e.target.value)}
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

        {/* {!readOnly && isFieldEmpty && (
          <div style={{ color: "red", fontSize: 11, marginTop: 2 }}>
            Required
          </div>
        )} */}
      </div>
    </div>
  );
}
