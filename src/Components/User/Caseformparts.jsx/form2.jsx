import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { setAlert } from "../../../Redux/Actions/AlertActions";

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
  const saved = useSelector(selectSectionData(key));
  const [scores, setScores] = useState(() => saved || {});

  // Keep local state in sync with Redux-loaded data (like form1)
  useEffect(() => {
    if (saved && Object.keys(saved).length > 0) {
      if (JSON.stringify(saved) !== JSON.stringify(scores)) {
        setScores(saved);
      }
    }
  }, [saved]);
 

  const isInitial = visit === "initial";

  
  // Helper function to calculate filled fields
  const calculateFilledFields = (scores) => {
    let filled = 0;
    for (const key in scores) {
      if (scores[key] && scores[key] !== "") {
        filled++;
      }
    }
    return filled;
  };

 
  const totalFields = LOCATIONS.length * 3;
  const filledFields = calculateFilledFields(scores);
  const percentFilled = (filledFields / totalFields) * 100 / FORM_COUNT;
  const isFieldEmpty = (muscle, side) => {
    const fieldKey = `${muscle}.${side}`;
    return !scores[fieldKey] || scores[fieldKey] === "";
  };
  // Dispatch percent to Redux
  let total = 0;
  for (const k in scores) {
    const v = scores[k];
    if (v !== "") total += Number(v);
  }

  const handleChange = (loc, field) => (e) => {
    const newValue = e.target.value;
    const newScores = {
      ...scores,
      [`${loc}.${field}`]: newValue
    };
    setScores(newScores);
  };

  

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  const prev = useRef({ total: null });
  
    useEffect(() => {
      if (prev.current.total !== total) {
        dispatch(pushSectionTotal(key, total));
        prev.current.total = total;
      }
  
      // if (prev.current.scores !== mergedScores) {
      //   dispatch(pushSectionData(key, mergedScores));
      //   prev.current.scores = mergedScores;
      // }
    }, [total, key, dispatch]);
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
                      Erosion/
                      Ulceration
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
                        <div>
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
                          {!readOnly && isFieldEmpty(loc, "erythema") && (
                            <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                              Required
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
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
                          {!readOnly && isFieldEmpty(loc, "scale") && (
                            <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                              Required
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
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
                          {!readOnly && isFieldEmpty(loc, "erosion") && (
                            <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                              Required
                            </div>
                          )}
                        </div>
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
