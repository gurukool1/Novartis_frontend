import React from "react";
import RangeInput from "./RangeInput";

export default function Form6({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const HAIRLOSS_OPTS = [0, 1];

  const handleChange = (newValue) => {
    const updated = { hairLoss: newValue };
    onChange(updated);
  };

  return (
    <div className="form-section-wrap panel panel-default mt-4">
      <div className="panel-body mt-3">
        <div className="table-outer">
          <div className="table-responsive scrollbar-clr">
            <table className="table theme-table bdr">
              <thead>
                <tr>
                  <th
                    colSpan="3"
                    style={{
                      borderBottom: "0.0625rem solid #ffffff30",
                      padding: "15px",
                      textAlign: "center",
                      fontSize: "18px",
                      color: "#fff",
                    }}
                  >
                    Alopecia
                  </th>
                </tr>
                <tr>
                  <th colSpan="2" style={{ padding: "12px", textAlign: "left" }}>
                    Recent Hair loss (within last 30 days as reported by the patient)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {/* descriptive text */}
                  <td
                    className="alltext"
                    style={{ padding: "12px", fontWeight: "bold" }}
                  >
                    0 - absent <br /> 1 - present
                  </td>

                  {/* selectable score (Range) */}
                  <td style={{ padding: "12px" }}>
                    <RangeInput
                      id={`${visit}_hairLoss`}
                      value={scores.hairLoss}
                      onChange={handleChange}
                      options={HAIRLOSS_OPTS}
                      disabled={readOnly}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
