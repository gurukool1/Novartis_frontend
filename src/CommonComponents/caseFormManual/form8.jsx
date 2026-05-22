export default function Form8({
  visit = "initial",
  scores = {},
  onChange
}) {
  const handleChange = (field, type, value) => {
    onChange({
      ...scores,
      [`${field}${type}`]: value
    });
  };

  return (
    <div className="table-outer mt-4" id={`form_Score_${visit}`}>
      <div className="table-responsive scrollbar-clr">
        <table className="table theme-table bdr">
          <thead>
            <tr>
              <th
                colSpan="3"
                className="text-center"
                style={{ fontSize: "20px", color: "#fff" }}
              >
                🔍 <strong>Overall Score Summary</strong>
              </th>
            </tr>
            <tr>
              <th>Score Type</th>
              <th className="text-center">Min</th>
              <th className="text-center">Max</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ fontWeight: "bold" }}>
                Total Activity Score
                <div style={{ fontWeight: "normal", fontSize: "12px", color: "#666" }}>
                  Add up the scores: Erythema, Scale, Excoriation, Ulceration, Gottron's, Periungual, Alopecia
                </div>
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="input sm light px-2"
                  style={{ width: 80, textAlign: "center" }}
                  value={scores.activitymin || ''}
                  onChange={(e) => handleChange("activity", "min", e.target.value)}
                  placeholder="Min"
                  id={`${visit}_activitymin`}
                />
              </td>
              <td className="text-center">
                <input
                  type="number"
                  className="input sm light px-2"
                  style={{ width: 80, textAlign: "center" }}
                  value={scores.activitymax || ''}
                  onChange={(e) => handleChange("activity", "max", e.target.value)}
                  placeholder="Max"
                  id={`${visit}_activitymax`}
                />
              </td>
            </tr>

            <tr>
              <td style={{ fontWeight: "bold", backgroundColor: "#f2dede", color: "#a94442" }}>
                Total Damage Score
                <div style={{ fontWeight: "normal", fontSize: "12px", color: "#a94442" }}>
                  Add up the scores: Poikiloderma, Calcinosis
                </div>
              </td>
              <td className="text-center" style={{ backgroundColor: "#f2dede" }}>
                <input
                  type="number"
                  className="input sm light px-2"
                  style={{ width: 80, textAlign: "center" }}
                  value={scores.damagemin || ''}
                  onChange={(e) => handleChange("damage", "min", e.target.value)}
                  placeholder="Min"
                  id={`${visit}_damagemin`}
                />
              </td>
              <td className="text-center" style={{ backgroundColor: "#f2dede" }}>
                <input
                  type="number"
                  className="input sm light px-2"
                  style={{ width: 80, textAlign: "center" }}
                  value={scores.damagemax || ''}
                  onChange={(e) => handleChange("damage", "max", e.target.value)}
                  placeholder="Max"
                  id={`${visit}_damagemax`}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}