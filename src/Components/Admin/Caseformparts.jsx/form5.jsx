import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form5({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();
  const PERI_OPTS = [0, 1, 2];
  const key = makeKey("Periungual", visit);
  const saved = useSelector(
    (state) => selectSectionData(key)(state),
    shallowEqual
  );

  const [peri, setPeri] = useState(saved.peri || "");
  useEffect(() => {
    setPeri(saved.peri ?? "");
  }, [saved]);

  const total = peri === "" ? 0 : Number(peri);

  // const FORM_COUNT = 14;
  const percentFilled = useMemo(() => {
    const filled = peri !== "" ? 1 : 0;
    const rawPercent = (filled / 1) * 100;
    const scaled = rawPercent * (1 / FORM_COUNT);
    return scaled;
  }, [peri]);

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  useEffect(() => {
    dispatch(pushSectionTotal(key, total));
    dispatch(pushSectionData(key, peri === "" ? {} : { peri }));
  }, [total, visit, peri, dispatch]);

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
                  <select
                    className="input sm light px-2"
                    style={{ width: 72 }}
                    value={peri}
                    onChange={(e) => setPeri(e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="">Select</option>
                    {PERI_OPTS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
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
