import React from "react";

export default function Form5({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const PERI_OPTS = [0, 1, 2];

  const handleChange = (e) => {
    const updated = { peri: e.target.value };
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
                    colSpan={2}
                    style={{
                      borderBottom: "0.0625rem solid #ffffff30",
                      padding: "15px",
                      textAlign: "center",
                      fontSize: "18px",
                    }}
                  >
                    Periungual
                  </th>
                </tr>
                <tr>
                  <th colSpan={2} style={{ padding: "12px", textAlign: "left" }}>
                    Periungual changes (examine)
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
                    0 - absent <br />
                    1 - pink/red erythema / microscopic telangiectasias <br />
                    2 - visible telangiectasias
                  </td>

                  {/* selectable score */}
                  <td style={{ padding: "12px" }}>
                    <select
                      className="input sm light px-2"
                      style={{ width: 72 }}
                      value={scores.peri || ""}
                      onChange={handleChange}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {PERI_OPTS.map((v) => (
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
