import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form3({ visit = "initial", readOnly = false, FORM_COUNT }) {
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
  const saved = useSelector(selectSectionData(key), shallowEqual);
  const [scores, setScores] = useState(saved);

  useEffect(() => {
    if (saved !== scores) setScores(saved);
  }, [saved]);

  const isInitial = visit === "initial";

  const handleChange = (loc, field) => (e) =>
    setScores((p) => ({ ...p, [`${loc}.${field}`]: e.target.value }));
  // const FORM_COUNT = 14;
  const percentFilled = useMemo(() => {
    const totalFields = DAMAGE_LOCATIONS.length * 2;
    const filledFields = Object.entries(scores).filter(
      ([, val]) => val !== "" && val !== "NA"
    ).length;

    const rawPercent = (filledFields / totalFields) * 100;
    const scaledPercent = rawPercent * (1 / FORM_COUNT);
    return scaledPercent;
  }, [scores]);

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  const totals = useMemo(() => {
    let poikilo = 0;
    let calc = 0;

    Object.entries(scores).forEach(([key, val]) => {
      if (val === "" || val == null) return;
      if (key.endsWith(".poikilo")) poikilo += Number(val);
      if (key.endsWith(".calcinosis")) calc += Number(val);
    });

    return { poikilo, calc, total: poikilo + calc };
  }, [scores]);

  const prev = useRef({ total: null, scores: null });
  useEffect(() => {
    if (prev.current.total !== totals.total) {
      dispatch(pushSectionTotal(key, totals.total));
      prev.current.total = totals.total;
    }
    if (prev.current.scores !== scores) {
      dispatch(pushSectionData(key, scores));
      prev.current.scores = scores;
    }
  }, [key, totals.total, scores, dispatch]);

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
                      </td>

                      <td>
                        <select
                          className="input sm light px-2"
                          style={{ width: "72px" }}
                          value={scores[`${loc}.calcinosis`] ?? ""}
                          onChange={handleChange(loc, "calcinosis")}
                          disabled={readOnly}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {CALCINOSIS_OPTS.map((v) => (
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
