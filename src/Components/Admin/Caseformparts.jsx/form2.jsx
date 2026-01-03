import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form2({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();
  const LOCATIONS = [
    "Scalp",
    "Malar Area",
    "Periorbital",
    "Rest of the Face",
    "V‑area Neck (Frontal)",
    "Posterior Neck",
    "Upper Back & Shoulders",
    "Rest of Back & Buttocks",
    "Abdomen",
    "Lateral Upper Thigh",
    "Rest of Leg & Feet",
    "Arm",
    "Mechanic's Hand",
    "Dorsum of Hands (Not Over Joints)",
    "Gottron's - Not on Hands",
  ];

  const ERYTHEMA_OPTS = [0, 1, 2, 3];
  const SCALE_OPTS = [0, 1, 2];
  const EROSION_OPTS = [0, 1];

  const key = makeKey("CDASI_Activity", visit);

  const saved = useSelector(selectSectionData(key), shallowEqual);

  const [scores, setScores] = useState(saved);
  useEffect(() => {
    if (saved !== scores) setScores(saved);
  }, [saved]);

  const isInitial = visit === "initial";

  const handleChange = (loc, field) => (e) =>
    setScores((prev) => ({ ...prev, [`${loc}.${field}`]: e.target.value }));

  const percentFilled = useMemo(() => {
    const totalFields = LOCATIONS.length * 3;
    const filledFields = Object.entries(scores).filter(
      ([, val]) => val !== "" && val !== "NA"
    ).length;

    const rawPercent = (filledFields / totalFields) * 100;
    const scaledPercent = rawPercent * (1 / FORM_COUNT);

    return scaledPercent;
  }, [scores]);

  // Dispatch percent to Redux
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  const total = useMemo(() => {
    let sum = 0;
    Object.values(scores).forEach((v) => {
      if (v !== "") sum += Number(v);
    });
    return sum;
  }, [scores]);
  const prev = useRef({ total: null, scores: null });

  useEffect(() => {
    if (prev.current.total !== total) {
      dispatch(pushSectionTotal(key, total));
      prev.current.total = total;
    }

    if (prev.current.scores !== scores) {
      dispatch(pushSectionData(key, scores));
      prev.current.scores = scores;
    }
  }, [total, scores, key, dispatch]);

  return (
    <div
      className="form-section-wrap panel panel-default mt-4"
      id="form3CDASIreadOnly"
    >
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? (
            <h5>Case Presentation: Initial</h5>
          ) : (
            <h5>Case Presentation: Follow up</h5>
          )}

          <hr className="horizontal-rule my-2" />
          <h5>
            Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI)
          </h5>
         
          <h2
            className="mt-3"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px",
              borderRadius: "5px",
              border: "2px solid #218838",
              textAlign: "center",
            }}
          >
            CDASI Activity
          </h2>
          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th className="essential persist">Anatomical Location</th>
                    <th className="optional">
                      Erythema
                    </th>
                    <th className="optional">
                      Scale
                    </th>
                    <th className="optional">
                      Erosion/Ulceration
                    </th>
                  </tr>
                  <tr style={{ borderTop: "0.0625rem solid #ffffff30" }}>
                    <th className="essential persist"></th>
                    <th
                      className="optional"
                      style={{ width: "150px", fontSize: "12px" }}
                    >
                      0 - absent <br />
                      1 - pink; faint erythema <br />
                      2 - red <br />3 - dark red
                    </th>
                    <th
                      className="optional"
                      style={{ width: "200px", fontSize: "12px" }}
                    >
                      0 - absent <br />
                      1 - scale <br />2 - crust; lichenification
                    </th>
                    <th style={{ fontSize: "12px" }}>
                      0 - absent <br />1 - present
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LOCATIONS.map((loc, i) => (
                    <tr key={i}>
                      <td>{loc}</td>
                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${loc}.erythema`] ?? ""}
                          onChange={handleChange(loc, "erythema")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {ERYTHEMA_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${loc}.scale`] ?? ""}
                          onChange={handleChange(loc, "scale")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {SCALE_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${loc}.erosion`] ?? ""}
                          onChange={handleChange(loc, "erosion")}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {EROSION_OPTS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
