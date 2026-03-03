export default function Form8({
  activityTotal = 0,
  damageTotal = 0,
}) {
  return (
    <div className="table-outer mt-4">
      <table className="table theme-table bdr">
        <tbody>
          <tr>
            <td>Total Activity Score</td>
            <td>
              <input
                readOnly
                value={activityTotal}
                className="input sm light px-2"
                style={{ width: 72 }}
              />
            </td>
          </tr>

          <tr>
            <td>Total Damage Score</td>
            <td>
              <input
                readOnly
                value={damageTotal}
                className="input sm light px-2"
                style={{ width: 72 }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
