import React, { useMemo, useEffect } from "react";
import RangeInput from "./RangeInput";
import { isRangeValue, computeRangeTotal, normalizeScoresToRange } from "./rangeUtils";

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

  const SCORE_OPTIONS = [...Array(11).keys()]; // 0–10

  const isInitial = visit === "initial";

  const handleChange = (muscle, side) => (newValue) => {
    const updated = {
      ...scores,
      [`${muscle}.${side}`]: newValue
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

    const filledFields = Object.values(scores).filter((val) => {
      if (val === "" || val === undefined || val === null) return false;
      if (val === "NA") return false;
      if (isRangeValue(val) && (val.min === "" || val.max === "")) return false;
      return true;
    }).length;

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

  // const summary = useMemo(() => {
  //   const perSide = { right: 0, left: 0, axial: 0 };

  //   Object.entries(scores).forEach(([key, val]) => {
  //     if (val === "" || val === "NA" || val === undefined || val === null) return;
  //     const [, side] = key.split(".");
  //     if (perSide[side] !== undefined) {
  //       if (isRangeValue(val)) {
  //         const min = Number(val.min) || 0;
  //         const max = Number(val.max) || 0;
  //         perSide[side] += (min + max) / 2;
  //       } else {
  //         perSide[side] += Number(val);
  //       }
  //     }
  //   });

  //   const total = perSide.right + perSide.left + perSide.axial;

  //   return { perSide, total: Math.round(total * 100) / 100 };
  // }, [scores]);

 const summary = useMemo(() => {
  const perSide = { right: 0, left: 0, axial: 0 };

  Object.entries(scores).forEach(([key, val]) => {
    if (val === "" || val === "NA" || val === undefined || val === null) return;

    const [, side] = key.split(".");
    if (!perSide.hasOwnProperty(side)) return;

    // ─── RANGE VALUE ─────────────────────────────
    if (isRangeValue(val)) {
      const min = Number(val.min);
      const max = Number(val.max);

      if (!isNaN(min) && !isNaN(max)) {
        perSide[side] += (min + max) / 2;
      }
      return;
    }

    // ─── PRESET OBJECT (0 / NA / BOTH) ───────────
    if (typeof val === "object" && val !== null && "value" in val) {
      const v = val.value;

      if (v === 0) {
        perSide[side] += 0;
      } else if (typeof v === "object" && v.zero === 0) {
        perSide[side] += 0;
      }
      return;
    }

    // ─── NORMAL NUMBER ───────────────────────────
    const num = Number(val);
    if (!isNaN(num)) {
      perSide[side] += num;
    }
  });

  const total =
    (perSide.right || 0) +
    (perSide.left || 0) +
    (perSide.axial || 0);

  return {
    perSide,
    total: Math.round(total * 100) / 100
  };
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
                      <RangeInput
                        value={scores["Neck Flexor.axial"]}
                        onChange={handleChange("Neck Flexor", "axial")}
                        options={SCORE_OPTIONS}
                        disabled={readOnly}
                        allowNA={true}
                      />
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
                              <RangeInput
                                value={scores[`${row.label}.${side}`]}
                                onChange={handleChange(row.label, side)}
                                options={SCORE_OPTIONS}
                                disabled={readOnly}
                                allowNA={true}
                              />
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
                        value={Math.round(summary.perSide.right * 100) / 100}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value={Math.round(summary.perSide.left * 100) / 100}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input sm light"
                        value={Math.round(summary.perSide.axial * 100) / 100}
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
