// import React from "react";

// export default function Form1({
//   visit = "initial",
//   readOnly = false,
//   scores = {},
//   onChange
// }) {
//   const muscles = [
//     "Neck Flexors",
//     "Deltoids",
//     "Biceps",
//     "Wrist Extensors",
//     "Quadriceps",
//     "Ankle Dorsiflexors"
//   ];

//   const sides = ["Right", "Left", "Axial"];
//   const SCORE_OPTIONS = [...Array(11).keys()].concat("NA");

//   const handleChange = (muscle, side) => (e) => {
//     const updated = {
//       ...scores,
//       [`${muscle}.${side}`]: e.target.value
//     };
//     onChange(updated);
//   };

//   const total = Object.values(scores)
//     .filter((v) => v !== "" && v !== "NA")
//     .map(Number)
//     .reduce((a, b) => a + b, 0);

//   return (
//     <div className="form-section-wrap mt-4">
//       <div className="panel-body mt-3">
//         <div className="table-container text-center">
//           <h5>MMT-8 ({visit})</h5>
//           <hr className="horizontal-rule my-2" />
//           <div className="table-outer mt-3">
//             <div className="table-responsive scrollbar-clr">
//               <table className="table theme-table bdr">
//                 <thead>
//                   <tr>
//                     <th>Muscle Group</th>
//                     <th style={{ width: 220 }}>Right <br /> (0‑10) <br /> NA</th>
//                     <th style={{ width: 210 }}>Left <br /> (0‑10) <br /> NA</th>
//                     <th style={{ width: 210 }}>Axial <br /> (0‑10) <br /> NA</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {muscles.map((muscle) => (
//                     <tr key={muscle}>
//                       <td>{muscle}</td>
//                       {sides.map((side) => (
//                         <td key={side}>
//                           <select
//                             className="input sm light px-2"
//                             style={{ width: "72px" }}
//                             value={scores[`${muscle}.${side}`] ?? ""}
//                             onChange={handleChange(muscle, side)}
//                             disabled={readOnly}
//                           >
//                             <option value="">Select</option>
//                             {SCORE_OPTIONS.map((opt) => (
//                               <option key={opt} value={opt}>
//                                 {opt}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}

//                   <tr className="total-scoring-value">
//                     <td>Total Score</td>
//                     <td colSpan={3}>
//                       <input
//                         type="text"
//                         className="input sm light"
//                         value={total}
//                         readOnly
//                       />
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useMemo, useEffect } from "react";

export default function Form1({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange,
  FORM_COUNT = 1,
  onPercentChange // optional callback if parent needs percent
}) {
  const ROWS = [
    { header: "Proximal Muscles" },
    { label: "Deltoid", cols: ["right", "left"] },
    { label: "Biceps", cols: ["right", "left"] },
    { label: "Quadriceps", cols: ["right", "left"] },
    { label: "Gluteus Medius", cols: ["right", "left"] },
    { label: "Gluteus Maximus", cols: ["right", "left"] },
    { header: "Distal Muscles" },
    { label: "Wrist Extensor", cols: ["right", "left"] },
    { label: "Ankle Dorsiflexion", cols: ["right", "left"] }
  ];

  const SCORE_OPTIONS = [...Array(11).keys()].concat("NA");

  const isInitial = visit === "initial";

  const handleChange = (muscle, side) => (e) => {
    const updated = {
      ...scores,
      [`${muscle}.${side}`]: e.target.value
    };
    onChange(updated);
  };

  /* ---------------- PERCENT CALCULATION ---------------- */

  const percentFilled = useMemo(() => {
    const totalFields =
      ROWS.reduce((acc, row) => {
        if (row.cols) return acc + row.cols.length;
        return acc;
      }, 0) + 1; // +1 for Neck Flexor axial

    const filledFields = Object.values(scores).filter(
      (val) => val !== "" && val !== "NA"
    ).length;

    const rawPercent = (filledFields / totalFields) * 100;
    const scaledPercent = rawPercent * (1 / FORM_COUNT);

    return scaledPercent || 0;
  }, [scores, FORM_COUNT]);

  useEffect(() => {
    if (onPercentChange) {
      onPercentChange(percentFilled);
    }
  }, [percentFilled, onPercentChange]);

  /* ---------------- SUMMARY CALCULATION ---------------- */

  const summary = useMemo(() => {
    const perSide = { right: 0, left: 0, axial: 0 };

    Object.entries(scores).forEach(([key, val]) => {
      if (val === "" || val === "NA") return;
      const [, side] = key.split(".");
      if (perSide[side] !== undefined) {
        perSide[side] += Number(val);
      }
    });

    const total = perSide.right + perSide.left + perSide.axial;

    return { perSide, total };
  }, [scores]);

  /* ---------------- UI ---------------- */

  return (
    <div className="form-section-wrap mt-4" id="form2mmt8">
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? (
            <h5>Case Presentation: Initial</h5>
          ) : (
            <h5>Case Presentation: Follow up</h5>
          )}

          <hr className="horizontal-rule my-2" />

          {isInitial ? (
            <h5>Manual Muscle Testing-8 (MMT-8)</h5>
          ) : (
            <h5>
              Answers with possible correct responses based on patient's
              examination in the case.
            </h5>
          )}

          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th>Muscle Group</th>
                    <th style={{ width: 220 }}>
                      Right <br /> (0-10) <br /> NA
                    </th>
                    <th style={{ width: 210 }}>
                      Left <br /> (0-10) <br /> NA
                    </th>
                    <th style={{ width: 210 }}>
                      Axial <br /> (0-10) <br /> NA
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Axial */}
                  <tr>
                    <th colSpan={4} className="text-center">
                      Axial Muscle
                    </th>
                  </tr>

                  <tr>
                    <td>Neck Flexor</td>
                    <td></td>
                    <td></td>
                    <td>
                      <select
                        className="input sm light px-2"
                        style={{ width: "72px" }}
                        value={scores["Neck Flexor.axial"] ?? ""}
                        onChange={handleChange("Neck Flexor", "axial")}
                        disabled={readOnly}
                      >
                        <option value="">Select</option>
                        {SCORE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Proximal & Distal */}
                  {ROWS.map((row, idx) =>
                    row.header ? (
                      <tr key={`header-${idx}`}>
                        <th colSpan={4} className="text-center">
                          {row.header}
                        </th>
                      </tr>
                    ) : (
                      <tr key={`row-${idx}`}>
                        <td>{row.label}</td>
                        {["right", "left", "axial"].map((side) => (
                          <td key={side}>
                            {row.cols.includes(side) ? (
                              <select
                                className="input sm light px-2"
                                style={{ width: "72px" }}
                                value={scores[`${row.label}.${side}`] ?? ""}
                                onChange={handleChange(row.label, side)}
                                disabled={readOnly}
                              >
                                <option value="">Select</option>
                                {SCORE_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    )
                  )}

                  {/* Individual Scores */}
                  <tr>
                    <th colSpan={4} className="text-center">
                      MMT-8 Scoring
                    </th>
                  </tr>

                  <tr className="total-individual-score">
                    <td>Individual Score</td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value={summary.perSide.right}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value={summary.perSide.left}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value={summary.perSide.axial}
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* Total Score */}
                  <tr className="total-scoring-value">
                    <td>Total Score</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value={summary.total}
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* Maximum Scores */}
                  <tr className="maximum-scoring">
                    <td>Maximum Individual Possible Score</td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value="70"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value="70"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value="10"
                        readOnly
                      />
                    </td>
                  </tr>

                  <tr className="total-scoring-value">
                    <td>Maximum Total Possible Score</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value="150"
                        readOnly
                      />
                    </td>
                  </tr>

                  {/* Percent Completion (optional display) */}
                  <tr>
                    <td>Completion %</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value={percentFilled.toFixed(2)}
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
