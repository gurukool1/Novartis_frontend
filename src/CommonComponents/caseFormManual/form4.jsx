import React from "react";

export default function Form4({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange
}) {
  const SCORE_OPTS = [0, 1, 2, 3];
  const ULCER_OPTS = [0, 1];
  const DAMAGE_OPTS = [0, 1, 2];
  const YESNO_OPTS = ["yes", "no"];

  const handleChange = (field) => (e) => {
    const updated = {
      ...scores,
      [field]: e.target.value
    };
    onChange(updated);
  };

  const doubledValue =
    scores.papule === "yes" && scores.score !== "" && scores.score != null
      ? Number(scores.score) * 2
      : "";

  const total =
    (doubledValue === "" ? 0 : Number(doubledValue)) +
    (scores.ulcer === "" ? 0 : Number(scores.ulcer)) +
    (scores.damage === "" ? 0 : Number(scores.damage));

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
                      Gottron’s – Hands
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
                      Examine the patient’s hands and double score if papules are
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
                      Examine patient’s hands and score if damage is present
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
                      0 - absent <br />
                      1 - pink; faint erythema <br />
                      2 - red erythema <br />
                      3 - dark red
                    </td>

                    {/* Score 0-3 */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <select
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        value={scores.score || ""}
                        onChange={handleChange("score")}
                        disabled={readOnly}
                      >
                        <option value="">Select</option>
                        {SCORE_OPTS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>

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

                    {/* Ulcer 0-1 */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <select
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        value={scores.ulcer || ""}
                        onChange={handleChange("ulcer")}
                        disabled={readOnly}
                      >
                        <option value="">Select</option>
                        {ULCER_OPTS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </td>

                    <td
                      className="alltext"
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      0 - absent <br />
                      1 - dyspigmentation <br />
                      2 - scarring
                    </td>

                    {/* Damage 0-2 */}
                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <select
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        value={scores.damage || ""}
                        onChange={handleChange("damage")}
                        disabled={readOnly}
                      >
                        <option value="">Select</option>
                        {DAMAGE_OPTS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Papule Present Row */}
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
                      Papule Present
                    </td>

                    <td style={{ border: "0.0625rem solid #b3b0b0", padding: "12px" }}>
                      <select
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        value={scores.papule || ""}
                        onChange={handleChange("papule")}
                        disabled={readOnly}
                      >
                        <option value="">Select</option>
                        {YESNO_OPTS.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
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
