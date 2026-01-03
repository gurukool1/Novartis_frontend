import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { useParams } from "react-router";
import { setAlert } from "../../../Redux/Actions/AlertActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form4({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();

  const SCORE_OPTS = [0, 1, 2, 3];
  const ULCER_OPTS = [0, 1];
  const DAMAGE_OPTS = [0, 1, 2];
  const YESNO_OPTS = ["yes", "no"];
  const key = makeKey("Gottron_Hands", visit);
  const saved = useSelector(selectSectionData(key));
  const [scores, setScores] = useState(() => saved || {});

  // Keep local state in sync with Redux-loaded data (like form1/form2)
  useEffect(() => {
    if (saved && Object.keys(saved).length > 0) {
      if (JSON.stringify(saved) !== JSON.stringify(scores)) {
        setScores(saved);
      }
    }
  }, [saved]);
  // Keep Redux first; else merge LS into current scores (like Form1)
  


  // Pull fields from merged object
  const score = scores.score ?? "";
  const ulcer = scores.ulcer ?? "";
  const damage = scores.damage ?? "";
  const papule = scores.papule ?? "";

  // Doubled (derived)
  const doubledValue =
    papule === "yes" && score !== "" && score !== null ? Number(score) * 2 : "";

  // Percent filled (same style as Form1: filled/total scaled by FORM_COUNT)
  const totalFields = 4; // score, ulcer, damage, papule
  const filledFields = [score, ulcer, damage, papule].filter((v) => v !== "").length;
  const percentFilled = (filledFields / totalFields) * 100 / FORM_COUNT;
  // Total
  const ds = doubledValue === "" ? 0 : Number(doubledValue);
  const u = ulcer === "" ? 0 : Number(ulcer);
  const d = damage === "" ? 0 : Number(damage);
  const total = ds + u + d;

  const isFieldEmpty = (field) => {
    return !scores[field] || scores[field] === "";
  };

  // Single change/blur handlers (like Form1)
  const handleChange = (field) => (e) => {
    const newValue = e.target.value;
    const next = { ...scores, [field]: newValue };
    setScores(next);
  };


  // Send percent like Form1
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  // Push total like Form1 (use ref guard)
  const prev = useRef({ total: null });
  useEffect(() => {
    if (prev.current.total !== total) {
      dispatch(pushSectionTotal(key, total));
      prev.current.total = total;
    }
  }, [total, key, dispatch]);

  // Keep Redux data in sync when scores object changes
  useEffect(() => {
    if (scores && Object.keys(scores).length > 0) {
      dispatch(pushSectionData(key, scores));
    }
  }, [scores, key, dispatch]);

  return (
    <div
      className="form-section-wrap panel panel-default mt-4"
      id="form3CDASIreadOnly"
    >
      <div className="panel-body mt-3">
        <div className="table-container ">
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

                    {/* score 0‑3 */}
                    <td
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                      }}
                    >
                      <div>
                        <select
                          className="input sm light px-2"
                          style={{ width: 72 }}
                          value={score}
                          onChange={handleChange("score")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {SCORE_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {!readOnly && isFieldEmpty("score") && (
                          <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                            Required
                          </div>
                        )}
                      </div>
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

                    {/* ulceration 0‑1 */}
                    <td
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                      }}
                    >
                      <div>
                        <select
                          className="input sm light px-2"
                          style={{ width: 72 }}
                          value={ulcer}
                          onChange={handleChange("ulcer")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {ULCER_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {!readOnly && isFieldEmpty("ulcer") && (
                          <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                            Required
                          </div>
                        )}
                      </div>
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

                    <td
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                      }}
                    >
                      <div>
                        <select
                          className="input sm light px-2"
                          style={{ width: 72 }}
                          value={damage}
                          onChange={handleChange("damage")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {DAMAGE_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {!readOnly && isFieldEmpty("damage") && (
                          <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                            Required
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* --- papule present row --- */}
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

                    {/* yes / no selector */}
                    <td
                      style={{
                        border: "0.0625rem solid #b3b0b0",
                        padding: "12px",
                      }}
                    >
                      <div>
                        <select
                          className="input sm light px-2"
                          style={{ width: 72 }}
                          value={papule}
                          onChange={handleChange("papule")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {YESNO_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {!readOnly && isFieldEmpty("papule") && (
                          <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                            Required
                          </div>
                        )}
                      </div>
                    </td>

                    <td
                      colSpan={3}
                      style={{
                        border: "0.0625rem solid #939393",
                        backgroundColor: "#939393",
                      }}
                    />
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
