import React from "react";
import RangeInput from "./RangeInput";
import { isRangeValue, computeRangeTotal } from "./rangeUtils";

export default function Form2({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const LOCATIONS = [
   "Scalp",
    "Malar Area",
    "Periorbital",
    "Rest of the Face",
    "V‑area Neck (Frontal)",
    "Posterior Neck",
    "Upper Back & Shoulders",
    "Rest of Back & Buttocks",
    "Abdomen",
    "Lateral Upper Thigh",
    "Rest of Leg & Feet",
    "Arm",
    "Mechanic's Hand",
    "Dorsum of Hands (Not Over Joints)",
    "Gottron's - Not on Hands",
  ];
  const ERYTHEMA_OPTS = [0, 1, 2, 3];
  const SCALE_OPTS = [0, 1, 2];
  const EROSION_OPTS = [0, 1];

  const handleChange = (loc, field) => (newValue) => {
    const updated = {
      ...scores,
      [`${loc}.${field}`]: newValue
    };
    onChange(updated);
  };

  const total = computeRangeTotal(scores);

  const isInitial = visit === "initial";

  return (
    <div className="form-section-wrap panel panel-default mt-4">
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? (
            <h5>Case Presentation: Initial</h5>
          ) : (
            <h5>Case Presentation: Follow up</h5>
          )}
          <hr className="horizontal-rule my-2" />
          <h5>Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI)</h5>

          <h2
            className="mt-3"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px",
              borderRadius: "5px",
              border: "2px solid #218838",
              textAlign: "center",
            }}
          >
            CDASI Activity
          </h2>

          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th className="essential persist">Anatomical Location</th>
                    <th className="optional">Erythema</th>
                    <th className="optional">Scale</th>
                    <th className="optional">Erosion/Ulceration</th>
                  </tr>
                  <tr style={{ borderTop: "0.0625rem solid #ffffff30" }}>
                    <th className="essential persist"></th>
                    <th className="optional" style={{ width: "150px", fontSize: "12px" }}>
                      0 - absent <br />
                      1 - pink; faint erythema <br />
                      2 - red <br />3 - dark red
                    </th>
                    <th className="optional" style={{ width: "200px", fontSize: "12px" }}>
                      0 - absent <br />
                      1 - scale <br />2 - crust; lichenification
                    </th>
                    <th style={{ fontSize: "12px" }}>
                      0 - absent <br />1 - present
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LOCATIONS.map((loc, i) => (
                    <tr key={i}>
                      <td>{loc}</td>
                      <td>
                        <RangeInput
                          value={scores[`${loc}.erythema`]}
                          onChange={handleChange(loc, "erythema")}
                          options={ERYTHEMA_OPTS}
                          disabled={readOnly}
                        />
                      </td>
                      <td>
                        <RangeInput
                          value={scores[`${loc}.scale`]}
                          onChange={handleChange(loc, "scale")}
                          options={SCALE_OPTS}
                          disabled={readOnly}
                        />
                      </td>
                      <td>
                        <RangeInput
                          value={scores[`${loc}.erosion`]}
                          onChange={handleChange(loc, "erosion")}
                          options={EROSION_OPTS}
                          disabled={readOnly}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="total-scoring-value">
                    <td>Total Score</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value={total}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
