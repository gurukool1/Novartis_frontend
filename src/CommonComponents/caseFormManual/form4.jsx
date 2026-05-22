import React from "react";
import RangeInput from "./RangeInput";
import { isRangeValue } from "./rangeUtils";

export default function Form4({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const SCORE_OPTS = [0, 1, 2, 3];
  const ULCER_OPTS = [0, 1];
  const DAMAGE_OPTS = [0, 1, 2];

  const handleChange = (field) => (newValue) => {
    const updated = {
      ...scores,
      [field]: newValue
    };
    onChange(updated);
  };

  // // Compute doubled value from score range
  // const getScoreAvg = () => {
  //   const val = scores.score;
  //   if (!val || val === "" || val === "NA") return "";
  //   if (isRangeValue(val)) {
  //     const min = Number(val.min) || 0;
  //     const max = Number(val.max) || 0;
  //     return (min + max) / 2;
  //   }
  //   return Number(val);
  // };


 const getScoreAvg = () => {
  const val = scores.score;

  if (!val) return 0;

  // ✅ handle preset
  if (typeof val === "object" && "value" in val) {
    if (val.value === 0) return 0;
    if (val.value === "NA") return 0;
    if (typeof val.value === "object" && val.value.zero === 0) return 0;
  }

  // ✅ range
  if (isRangeValue(val)) {
    const min = Number(val.min) || 0;
    const max = Number(val.max) || 0;
    return (min + max) / 2;
  }

  // ✅ number
  return Number(val) || 0;
};



  const scoreAvg = getScoreAvg();
  const papuleVal = scores.papule;
  // const doubledValue =
  //   papuleVal === "yes" && scoreAvg !== ""
  //     ? Math.round(scoreAvg * 2 * 100) / 100
  //     : "";

  // const doubledValue =
  // papuleVal === "yes"
  //   ? Math.round(scoreAvg * 2 * 100) / 100
  //   : 0;
  // const getNumericAvg = (field) => {
  //   const val = scores[field];
  //   if (!val || val === "" || val === "NA") return 0;
  //   if (isRangeValue(val)) {
  //     return ((Number(val.min) || 0) + (Number(val.max) || 0)) / 2;
  //   }
  //   return Number(val);
  // };

  const getDoubledValue = () => {
  const val = scores.score;

  if (!val || papuleVal !== "yes") return 0;

  // ✅ range value
  if (isRangeValue(val)) {
    const min = (Number(val.min) || 0);
    const max = (Number(val.max) || 0);

    return min * max
  }

  // ✅ normal number
  return (Number(val) || 0) * 2;
};

const doubledValue = getDoubledValue();





  const getNumericAvg = (field) => {
  const val = scores[field];

  if (!val) return 0;

  // ✅ handle preset
  if (typeof val === "object" && "value" in val) {
    if (val.value === 0) return 0;
    if (val.value === "NA") return 0;
    if (typeof val.value === "object" && val.value.zero === 0) return 0;
  }

  // ✅ range
  if (isRangeValue(val)) {
    return ((Number(val.min) || 0) + (Number(val.max) || 0)) / 2;
  }

  // ✅ number
  return Number(val) || 0;
};




  const total = Math.round(
    ((doubledValue === "" ? 0 : Number(doubledValue)) +
      getNumericAvg("ulcer") +
      getNumericAvg("damage")) * 100
  ) / 100;

  const isInitial = visit === "initial";

  return (
    <div className="form-section-wrap panel panel-default mt-4">
      <div className="panel-body mt-3">
        <div className="table-container">
          <div className="table-outer">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th
                      colSpan="5"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        borderBottomColor: "#ffffff30",
                        padding: "15px",
                        textAlign: "center",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    >
                      Gottron's – Hands
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan="2"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      Examine the patient's hands and double score if papules are
                      present
                    </th>
                    <th
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        textAlign: "center",
                        fontSize: "16px",
                      }}
                    >
                      Ulceration
                    </th>
                    <th
                      colSpan="2"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      Examine patient's hands and score if damage is present
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="alltext"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      0 - absent <br />
                      1 - pink; faint erythema <br />
                      2 - red erythema <br />
                      3 - dark red
                    </td>

                    {/* Score 0-3 (Range) */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <RangeInput
                        id={`${visit}_score`}
                        value={scores.score}
                        onChange={handleChange("score")}
                        options={SCORE_OPTS}
                        disabled={readOnly}
                      />

                      <div style={{ marginTop: 8, fontSize: 12 }}>
                        Doubled Score (Read only)
                      </div>
                      <input
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        readOnly
                        value={doubledValue}
                      />
                    </td>

                    {/* Ulcer 0-1 (Range) */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <RangeInput
                        id={`${visit}_ulcer`}
                        value={scores.ulcer}
                        onChange={handleChange("ulcer")}
                        options={ULCER_OPTS}
                        disabled={readOnly}
                      />
                    </td>

                    <td
                      className="alltext"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      0 - absent <br />
                      1 - dyspigmentation <br />
                      2 - scarring
                    </td>

                    {/* Damage 0-2 (Range) */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <RangeInput
                        id={`${visit}_damage`}
                        value={scores.damage}
                        onChange={handleChange("damage")}
                        options={DAMAGE_OPTS}
                        disabled={readOnly}
                      />
                    </td>
                  </tr>

                  {/* Papule Present Row — NON-NUMERIC (yes/no) */}
                  <tr style={{ textAlign: "center" }}>
                    <td
                      className="alltext"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        textAlign: "left",
                        fontSize: 14,
                      }}
                    >
                      Papule Present
                    </td>

                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <RangeInput
                        id={`${visit}_papule`}
                        value={scores.papule}
                        onChange={handleChange("papule")}
                        isNonNumeric={true}
                        nonNumericOpts={["yes", "no"]}
                        disabled={readOnly}
                      />
                    </td>

                    <td colSpan={3} style={{ border: "0.0625rem solid #939393", backgroundColor: "#939393" }} />
                  </tr>

                  <tr>
                    <td colSpan={5} style={{ textAlign: "right", padding: 12, fontWeight: "bold" }}>
                      Total: {total}
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
