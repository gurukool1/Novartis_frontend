import { useSelector } from "react-redux";
import {
  selectGrandTotal,
  selectDamageTotal,
} from "../../../Redux/Actions/FormActions";

export default function Form8({ visit = "initial" }) {
  const activityTotal = useSelector(selectGrandTotal(visit)) ?? 0;
  const damageTotal = useSelector(selectDamageTotal(visit)) ?? 0;

  return (
    <div className="table-outer mt-4">
      <div className="table-responsive scrollbar-clr">
        <table className="table theme-table bdr">
          <thead>
            <tr>
              <th
                colSpan="2"
                className="text-center"
                style={{ fontSize: "20px", color: "#fff" }}
              >
                🔍 <strong>Overall Score Summary</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: "bold" }}>Total Activity Score</td>
              <td
                className="text-center"
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  backgroundColor: "#80f6ff",
                  color: "#333",
                }}
              >
                <input
                  className="input sm light px-2"
                  style={{ width: 72, textAlign: "center" }}
                  readOnly
                  value={activityTotal}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ padding: "12px" }}>
                Add up the scores: Erythema, Scale, Excoriation, Ulceration,
                Gottron's, Periungual, Alopecia
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#f2dede",
                  color: "#a94442",
                }}
              >
                Total Damage Score
              </td>
              <td
                className="text-center"
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  backgroundColor: "#f2dede",
                  color: "#a94442",
                }}
              >
                <input
                  className="input sm light px-2"
                  style={{ width: 72, textAlign: "center" }}
                  readOnly
                  value={damageTotal}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ padding: "12px" }}>
                Add up the scores: Poikiloderma, Calcinosis
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
