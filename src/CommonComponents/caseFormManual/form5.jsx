import React from "react";
import RangeInput from "./RangeInput";

export default function Form5({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const PERI_OPTS = [0, 1, 2];

  const handleChange = (newValue) => {
    const updated = { peri: newValue };
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
                    0 - absent <br />
                    1 - pink/red erythema / microscopic telangiectasias <br />
                    2 - visible telangiectasias
                  </td>

                  {/* selectable score (Range) */}
                  <td style={{ padding: "12px" }}>
                    <RangeInput
                      id={`${visit}_peri`}
                      value={scores.peri}
                      onChange={handleChange}
                      options={PERI_OPTS}
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
