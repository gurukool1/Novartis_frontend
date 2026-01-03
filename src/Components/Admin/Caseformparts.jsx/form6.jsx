import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form6({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();
  const hairlossopts = [0, 1];
  const key = makeKey("Alopecia", visit);
  const saved = useSelector(
    (state) => selectSectionData(key)(state),
    shallowEqual
  );

  const [hairLoss, setHairLoss] = useState(saved.hairLoss || "");
  useEffect(() => {
    setHairLoss(saved.hairLoss ?? "");
  }, [saved]);

  const total = hairLoss === "" ? 0 : Number(hairLoss);

  // const FORM_COUNT = 14;
  const percentFilled = useMemo(() => {
    const filled = hairLoss !== "" ? 1 : 0;
    const rawPercent = (filled / 1) * 100;
    const scaled = rawPercent * (1 / FORM_COUNT);
    return scaled;
  }, [hairLoss]);

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  useEffect(() => {
    dispatch(pushSectionTotal(key, total));
    dispatch(pushSectionData(key, hairLoss === "" ? {} : { hairLoss }));
  }, [total, visit, hairLoss, dispatch]);
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
                    value={hairLoss}
                    onChange={(e) => setHairLoss(e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="">Select</option>
                    {hairlossopts.map((v) => (
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
