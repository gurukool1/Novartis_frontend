import React from "react";

export default function Form3({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const AREAS = [

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

    "Rest of Leg and feet",
    "Arm",
    "Mechanic's Hand",
    "Dorsums of hands (Not Over Joints)",
    "Gottron's - Not on Hands",
  ];        
  const POIKILO_OPTS = [0, 1, 2];
  const CALCINOSIS_OPTS = [0, 1];

  const handleChange = (area, field) => (e) => {
    const updated = {
      ...scores,
      [`${area}.${field}`]: e.target.value
    };
    onChange(updated);
  };

  const total = Object.values(scores)
    .filter((v) => v !== "" && v !== "NA")
    .map(Number)
    .reduce((a, b) => a + b, 0);

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

          <h2
            className="mt-3"
            style={{
              backgroundColor: "rgb(231, 31, 31)",
              color: "white",
              padding: "12px",
              borderRadius: "5px",
              border: "2px solid #fe0000",
              textAlign: "center",
            }}
          >
            CDASI Damage
          </h2>

          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th>Anatomical Location</th>
                    <th>Poikiloderma (Dyspigmentation or Telangiectasia)</th>
                    <th>Calcinosis</th>
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((area, i) => (
                    <tr key={i}>
                      <td>{area}</td>
                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${area}.poikilo`] ?? ""}
                          onChange={handleChange(area, "poikilo")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {POIKILO_OPTS.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${area}.calcinosis`] ?? ""}
                          onChange={handleChange(area, "calcinosis")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {CALCINOSIS_OPTS.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  <tr className="total-scoring-value">
                    <td>Total Score</td>
                    <td colSpan={2}>
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
