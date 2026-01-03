import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { useParams } from "react-router";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form4({ visit = "initial", readOnly = false,FORM_COUNT }) {
  const dispatch = useDispatch();

  const SCORE_OPTS = [0, 1, 2, 3];
  const ULCER_OPTS = [0, 1];
  const DAMAGE_OPTS = [0, 1, 2];
  const YESNO_OPTS = ["yes", "no"];
  const key = makeKey("Gottron_Hands", visit);

  const saved = useSelector(
    (state) => selectSectionData(key)(state),
    shallowEqual
  );

  const [score, setScore] = useState(saved.score || "");
  const [ulcer, setUlcer] = useState(saved.ulcer || "");
  const [damage, setDamage] = useState(saved.damage || "");
  const [papule, setPapule] = useState(saved.papule || "");

  useEffect(() => {
    if (!saved) {
      setScore("");
      setUlcer("");
      setDamage("");
      setPapule("");
      return;
    }
    setScore(saved.score ?? "");
    setUlcer(saved.ulcer ?? "");
    setDamage(saved.damage ?? "");
    setPapule(saved.papule ?? "");
  }, [saved]);

  const doubledValue = (() => {
    if (papule === "yes" && score !== "" && score !== null) {
      return Number(score) * 2;
    }
    return "";
  })();
  const answers = useMemo(
    () => ({
      ...(score !== null && { score }),
      ...(ulcer !== null && { ulcer }),
      ...(damage !== null && { damage }),
      ...(papule !== null && { papule }),
      ...(doubledValue !== null && { doubled: doubledValue }),
    }),
    [score, ulcer, damage, papule, doubledValue]
  );

  const total = useMemo(() => {
    const ds = doubledValue === "" ? 0 : Number(doubledValue);
    const u = ulcer === "" ? 0 : Number(ulcer);
    const d = damage === "" ? 0 : Number(damage);
    return ds + u + d;
  }, [doubledValue, ulcer, damage]);

  // const FORM_COUNT = 14;
  const percentFilled = useMemo(() => {
    const totalFields = 4; // score, ulcer, damage, papule
    const filled = [score, ulcer, damage, papule].filter(
      (val) => val !== ""
    ).length;

    const rawPercent = (filled / totalFields) * 100;
    const scaled = rawPercent * (1 / FORM_COUNT);
    return scaled;
  }, [score, ulcer, damage, papule]);

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  const prev = useRef({ total: null, answers: null });

  useEffect(() => {
    if (prev.current.total !== total) {
      dispatch(pushSectionTotal(key, total));
      prev.current.total = total;
    }
    if (prev.current.answers !== answers) {
      dispatch(pushSectionData(key, answers));
      prev.current.answers = answers;
    }
  }, [total, answers, key, dispatch]);

  return (
    <div
      className="form-section-wrap panel panel-default mt-4"
      id="form3CDASIreadOnly"
    >
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

                  {/* score 0‑3 */}
                  <td
                    style={{
                      border: "0.0625rem solid #b3b0b0",
                      padding: "12px",
                    }}
                  >
                    <select
                      className="input sm light px-2"
                      style={{ width: 72 }}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {SCORE_OPTS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
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

                  {/* ulceration 0‑1 */}
                  <td
                    style={{
                      border: "0.0625rem solid #b3b0b0",
                      padding: "12px",
                    }}
                  >
                    <select
                      className="input sm light px-2"
                      style={{ width: 72 }}
                      value={ulcer}
                      onChange={(e) => setUlcer(e.target.value)}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {ULCER_OPTS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
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

                  <td
                    style={{
                      border: "0.0625rem solid #b3b0b0",
                      padding: "12px",
                    }}
                  >
                    <select
                      className="input sm light px-2"
                      style={{ width: 72 }}
                      value={damage}
                      onChange={(e) => setDamage(e.target.value)}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {DAMAGE_OPTS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
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
                    <select
                      className="input sm light px-2"
                      style={{ width: 72 }}
                      value={papule}
                      onChange={(e) => setPapule(e.target.value)}
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {YESNO_OPTS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
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
