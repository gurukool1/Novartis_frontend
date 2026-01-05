import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { setAlert } from "../../../Redux/Actions/AlertActions";

const makeKey = (section, visit) => `${section}_${visit}`;

export default function Form1({
  visit = "initial",
  readOnly = false,
  FORM_COUNT,
}) {
  const dispatch = useDispatch();
  const ROWS = [
    { header: "Proximal Muscles" },
    { label: "Deltoid", cols: ["right", "left"] },
    { label: "Biceps", cols: ["right", "left"] },
    { label: "Quadriceps", cols: ["right", "left"] },
    { label: "Gluteus Medius", cols: ["right", "left"] },
    { label: "Gluteus Maximus", cols: ["right", "left"] },
    { header: "Distal Muscles" },
    { label: "Wrist Extensor", cols: ["right", "left"] },
    { label: "Ankle Dorsiflexion", cols: ["right", "left"] },
  ];

  const SCORE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "NA"];
  const key = makeKey("MMT_8", visit);

  const saved = useSelector(selectSectionData(key));
  const [scores, setScores] = useState(() => saved || {});
  useEffect(() => {
    if (saved && Object.keys(saved).length > 0) {
      if (JSON.stringify(saved) !== JSON.stringify(scores)) {
        setScores(saved);
      }
    }
  }, [saved]);
  // useEffect(() => {
  //   if (saved !== scores) setScores(saved);
  // }, [saved]);

  const isInitial = visit === "initial";

  // const handleChange = (muscle, side) => (e) => {
  //   setScores((prev) => ({ ...prev, [`${muscle}.${side}`]: e.target.value }));
  // };

  const calculateTotalFields = (rows) => {
    let total = 1;
    rows.forEach((row) => {
      if (row.cols) {
        total += row.cols.length;
      }
    });
    return total;
  };

  // Helper function to calculate filled fields
  const calculateFilledFields = (scores) => {
    let filled = 0;
    for (const key in scores) {
      if (scores[key] && scores[key] !== "") {
        filled++;
      }
    }
    return filled;
  };

  // Helper function to calculate totals per side
  const calculateSummary = (scores) => {
    const perSide = { right: 0, left: 0, axial: 0 };

    for (const muscleAndSide in scores) {
      const score = scores[muscleAndSide];
      if (!score || score === "NA") continue;

      const side = muscleAndSide.split(".")[1];
      perSide[side] += Number(score);
    }

    return {
      perSide,
      total: perSide.right + perSide.left + perSide.axial,
    };
  };

  const totalFields = calculateTotalFields(ROWS);
  const filledFields = calculateFilledFields(scores);

  const percentFilled = ((filledFields / totalFields) * 100) / FORM_COUNT;
  // Calculate summary
  const summary = calculateSummary(scores);
  // const total = summary.total;
  const isFieldEmpty = (muscle, side) => {
    const fieldKey = `${muscle}.${side}`;
    return !scores[fieldKey] || scores[fieldKey] === "";
  };

  const handleChange = (muscle, side) => (e) => {
    const newValue = e.target.value;
    const newScores = {
      ...scores,
      [`${muscle}.${side}`]: newValue,
    };
    setScores(newScores);
  };

  // Dispatch the calculated percent to the Redux store
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  // const total = summary.total;
  // const prev = useRef({ total: null });

  // useEffect(() => {
  //   if (prev.current.total !== total) {
  //     dispatch(pushSectionTotal(key, total));
  //     prev.current.total = total;
  //   }

  //   // if (prev.current.scores !== mergedScores) {
  //   //   dispatch(pushSectionData(key, mergedScores));
  //   //   prev.current.scores = mergedScores;
  //   // }
  // }, [total, key, dispatch]);
  useEffect(() => {
    if (scores && Object.keys(scores).length > 0) {
      dispatch(pushSectionData(key, scores));
    }
  }, [scores, key, dispatch]);

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
            <h5>Manual Muscle Testing‑8 (MMT‑8)</h5>
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
                      Right <br />
                      (0‑10) <br /> NA (Not Assessed)
                    </th>
                    <th style={{ width: 210 }}>
                      Left  <br /> (0‑10) <br />
                      NA (Not Assessed)
                    </th>
                    <th style={{ width: 210 }}>
                      Axial
                      <br />
                      (0‑10) <br />
                      NA (Not Assessed)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th colSpan={4} className="text-center">
                      Axial Muscle
                    </th>
                  </tr>
                  <tr>
                    <td>Neck Flexor</td>
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
                      {!readOnly && isFieldEmpty("Neck Flexor", "axial") && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          Required
                        </div>
                      )}
                    </td>
                  </tr>

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
                              <div>
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
                                {!readOnly && isFieldEmpty(row.label, side) && (
                                  <div
                                    style={{
                                      color: "red",
                                      fontSize: "11px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    Required
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                  <tr>
                    <th colSpan={5} className="text-center">
                      MMT-8 Scoring
                    </th>
                  </tr>
                  <tr className="total-individual-score">
                    <td>Individual Score</td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value={summary.perSide.right}
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value={summary.perSide.left}
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value={summary.perSide.axial}
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>

                  <tr className="total-scoring-value">
                    <td>Total Score</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value={summary.total}
                        readOnly
                      />
                    </td>
                  </tr>

                  <tr className="maximum-scoring">
                    <td>Maximum Individual Possible Score</td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value="70"
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value="70"
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <div className="slider-container">
                        <input
                          type="text"
                          className="input sm light"
                          value="10"
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="total-scoring-value">
                    <td>Maximum Total Possible score</td>
                    <td colSpan={3}>
                      <input
                        type="text"
                        className="input sm light"
                        value="150"
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
