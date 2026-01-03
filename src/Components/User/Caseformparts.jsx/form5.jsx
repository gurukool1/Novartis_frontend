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
export default function Form5({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();
  const PERI_OPTS = [0, 1, 2];
  const key = makeKey("Periungual", visit);
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

  // Same sync pattern as Form1
  

  // Percent: totalFields=1, filled if peri not empty
  const totalFields = 1;
  const filledFields = scores.peri !== undefined && scores.peri !== "" ? 1 : 0;
  const percentFilled = (filledFields / totalFields) * 100 / FORM_COUNT;
  // Total score for this form is just the selected value (0/1/2)
  const total = scores.peri === "" || scores.peri === undefined
    ? 0
    : Number(scores.peri);

  const isFieldEmpty = (field) => {
    return !scores[field] || scores[field] === "";
  };
  // Same handlers as Form1
  const handleChange = (e) => {
    const newValue = e.target.value;
    const newScores = { ...scores, peri: newValue };
    setScores(newScores);
  };

 

  // Dispatch percent like Form1
  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  // Guarded total dispatch like Form1
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
                  {/* descriptive text stays the same */}
                  <td className="alltext" style={{ padding: "12px" }}>
                    0 - absent <br />
                    1 - pink/red erythema / microscopic telangiectasias
                    <br />
                    2 - visible telangiectasias
                  </td>

                  {/* selectable score 0‑2 */}
                  <td style={{ padding: "12px" }}>
                    <div>
                      <select
                        className="input sm light px-2"
                        style={{ width: 72 }}
                        value={scores.peri ?? ""}
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
                      {!readOnly && isFieldEmpty("peri") && (
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
