import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;

export default function Form1({ visit = "initial", readOnly = false, FORM_COUNT}) {
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

  const SCORE_OPTIONS = [...Array(11).keys()].concat("NA");
  const key = makeKey("MMT_8", visit);

  const saved = useSelector(selectSectionData(key), shallowEqual);
  const [scores, setScores] = useState(saved);
  useEffect(() => {
    if (saved !== scores) setScores(saved);
  }, [saved]);

  const isInitial = visit === "initial";

  const handleChange = (muscle, side) => (e) => {
    setScores((prev) => ({ ...prev, [`${muscle}.${side}`]: e.target.value }));
  };

  const percentFilled = useMemo(() => {
    const totalFields = ROWS.reduce((acc, row) => {
      if (row.cols) return acc + row.cols.length;
      return acc;
    }, 1); // Avoid division by 0

    const filledFields = Object.entries(scores).filter(
      ([, val]) => val !== "" && val !== "NA"
    ).length;

    const rawPercent = (filledFields / totalFields) * 100;
    const scaledPercent = rawPercent * (1 / FORM_COUNT); // scale to total 100

    return scaledPercent;
  }, [scores]);

  // Dispatch the calculated percent to the Redux store
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  const summary = useMemo(() => {
    const perSide = { right: 0, left: 0, axial: 0 };

    Object.entries(scores).forEach(([key, val]) => {
      if (val === "" || val === "NA") return;
      const [, side] = key.split(".");
      perSide[side] += Number(val);
    });

    const total = perSide.right + perSide.left + perSide.axial;
    return { perSide, total };
  }, [scores]);
  // const total = summary.total;
  const prev = useRef({ scores: null });

  useEffect(() => {
    
    if (prev.current.scores !== scores) {
      dispatch(pushSectionData(key, scores));
      prev.current.scores = scores;
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
                      (0‑10) <br /> NA
                    </th>
                    <th style={{ width: 210 }}>
                      Left  <br /> (0‑10) <br />
                      NA
                    </th>
                    <th style={{ width: 210 }}>
                      Axial
                      <br />
                      (0‑10) <br />
                      NA
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
                        <option value="" disabled>
                          Select
                        </option>
                        {SCORE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
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
