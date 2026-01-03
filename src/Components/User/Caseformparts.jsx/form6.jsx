import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { setAlert } from "../../../Redux/Actions/AlertActions";


const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form6({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();
  const hairlossopts = [0, 1];
  const key = makeKey("Alopecia", visit);
  const saved = useSelector(selectSectionData(key));
  const [scores, setScores] = useState(() => saved || {});

  // Sync local state from Redux
  useEffect(() => {
    if (saved && Object.keys(saved).length > 0) {
      if (JSON.stringify(saved) !== JSON.stringify(scores)) {
        setScores(saved);
      }
    }
  }, [saved]);
  

  // Same sync pattern as Form1 (Redux first, else merge LS)
  

  const value = scores.hairLoss ?? "";

  // Percent (same style as Form1): filled/total scaled by FORM_COUNT
  const totalFields = 1;
  const filledFields = value !== "" ? 1 : 0;
  const percentFilled = (filledFields / totalFields) * 100 / FORM_COUNT;
  // Total for this form = numeric value or 0
  const total = value === "" ? 0 : Number(value);
  const isFieldEmpty = (field) => {
    return !scores[field] || scores[field] === "";
  };
  // Same handlers as Form1
  const handleChange = (e) => {
    const newValue = e.target.value;
    const newScores = { ...scores, hairLoss: newValue };
    setScores(newScores);
  };


  // Dispatch percent like Form1
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  // Guarded total push like Form1
  const prev = useRef({ total: null });
  useEffect(() => {
    if (prev.current.total !== total) {
      dispatch(pushSectionTotal(key, total));
      prev.current.total = total;
    }
  }, [total, key, dispatch]);

  // Keep Redux data updated when scores change (like Form1)
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
                    Recent Hair loss (within last 30 days as reported by the
                    patient)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="alltext" style={{ padding: "12px" }}>
                    0 - absent <br /> 1 - present
                  </td>
                  <td style={{ padding: "12px" }}>
                    <select
                      className="input sm light px-2"
                      style={{ width: "72px" }}
                      value={scores.hairLoss ?? ""}
                      onChange={handleChange}
                      
                      disabled={readOnly}
                    >
                      <option value="">Select</option>
                      {hairlossopts.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <div>
                      {!readOnly && isFieldEmpty("hairLoss") && (
                        <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                          Required
                        </div>
                      )}
                    </div>
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
