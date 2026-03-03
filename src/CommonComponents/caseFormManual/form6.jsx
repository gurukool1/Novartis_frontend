import React from "react";

export default function Form6({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const HAIRLOSS_OPTS = [0, 1];

  const handleChange = (e) => {
    const updated = { alopecia: e.target.value };
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

                  {/* selectable score 0‑1 */}
                  <td style={{ padding: "12px" }}>
                    <select
                      className="input sm light px-2"
                      style={{ width: "72px" }}
                      value={scores.alopecia || ""}
                      onChange={handleChange}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {HAIRLOSS_OPTS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
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
