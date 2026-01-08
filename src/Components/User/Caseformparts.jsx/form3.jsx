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
export default function Form3({
  visit = "initial",
  readOnly = false,
  FORM_COUNT,
}) {
  const dispatch = useDispatch();
  const DAMAGE_LOCATIONS = [
    "Scalp",
    "Malar Area",
    "Periorbital",
    "Rest of the Face",
    "V ‑ area Neck (Frontal)",
    "Posterior Neck",
    "Upper Back & Shoulders",
    "Rest of Back & Buttocks",
    "Abdomen",
    "Lateral Upper Thigh",
    "Rest of Leg & Feet",
    "Arm",
    "Mechanic's Hand",
    "Dorsums of hands (Not Over Joints)",
    "Gottron's - Not on Hands",
  ];

  const POIKILO_OPTS = [0, 1, 2];
  const CALCINOSIS_OPTS = [0, 1];
  const key = makeKey("CDASI_Damage", visit);
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
  const isInitial = visit === "initial";

  const calculateFilledFields = (obj) => {
    let filled = 0;
    for (const k in obj) {
      if (obj[k] && obj[k] !== "") filled++;
    }
    return filled;
  };

  const calculateTotals = (obj) => {
    let poikilo = 0;
    let calc = 0;
    for (const k in obj) {
      const v = obj[k];
      if (v === "" || v == null) continue;
      if (k.endsWith(".poikilo")) poikilo += Number(v);
      if (k.endsWith(".calcinosis")) calc += Number(v);
    }
    return { poikilo, calc, total: poikilo + calc };
  };

  const totalFields = DAMAGE_LOCATIONS.length * 2;
  const filledFields = calculateFilledFields(scores);
  const percentFilled = ((filledFields / totalFields) * 100) / FORM_COUNT;
  const totals = calculateTotals(scores);
  const total = totals.total;
  const isFieldEmpty = (loc, field) => {
    const fieldKey = `${loc}.${field}`;
    return !scores[fieldKey] || scores[fieldKey] === "";
  };

  const handleChange = (loc, field) => (e) => {
    const newValue = e.target.value;
    const newScores = {
      ...scores,
      [`${loc}.${field}`]: newValue,
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
  }, [total, key, dispatch]);

  useEffect(() => {
    if (scores && Object.keys(scores).length > 0) {
      dispatch(pushSectionData(key, scores));
    }
  }, [scores, key, dispatch]);

  return (
    <div
      className="form-section-wrap panel panel-default mt-4"
      id="form4CDASIDamange"
    >
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? (
            <h5>Case 1 Presentation: Initial</h5>
          ) : (
            <h5>Case Presentation: Follow up</h5>
          )}

          <h2
            className="mt-3"
            style={{
              backgroundColor: "rgb(231, 31, 31)",
              color: "white",
              padding: "12px",
              borderRadius: "5px",
              border: "2px solid #fe0000",
              textAlign: "center",
            }}
          >
            CDASI Damage
          </h2>
          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table id="cdasi_damage-table" className="table theme-table bdr">
                <thead>
                  <tr>
                    <th>Anatomical Location</th>
                    <th>Poikiloderma (Dyspigmentation or Telangiectasia)</th>
                    <th>Calcinosis</th>
                  </tr>
                </thead>
                <tbody>
                  {DAMAGE_LOCATIONS.map((loc, i) => (
                    <tr key={i}>
                      <td>{loc}</td>
                      <td>
                        <div>
                          <select
                            className="input sm light px-2"
                            style={{ width: "72px" }}
                            value={scores[`${loc}.poikilo`] ?? ""}
                            onChange={handleChange(loc, "poikilo")}
                            disabled={readOnly}
                          >
                            <option value="">Select</option>
                            {POIKILO_OPTS.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                          {!readOnly && isFieldEmpty(loc, "poikilo") && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "2px",
                              }}
                            >
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
                            value={scores[`${loc}.calcinosis`] ?? ""}
                            onChange={handleChange(loc, "calcinosis")}
                            disabled={readOnly}
                          >
                            <option value="">Select</option>
                            {CALCINOSIS_OPTS.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                          {!readOnly && isFieldEmpty(loc, "calcinosis") && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "2px",
                              }}
                            >
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
