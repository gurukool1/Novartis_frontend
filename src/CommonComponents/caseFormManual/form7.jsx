// import { useMemo } from "react";

// export default function Form7({
//   visit = "initial",
//   readOnly = false,
//   FORM_COUNT,
//   formData = {},
//   setFormData,
// }) {
//   const CF_OPTS = [0, 1, 2, 3, 4, "NA"];

//   const handleChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "NA" ? "NA" : Number(value),
//     }));
//   };

//   const percentFilled = useMemo(() => {
//     const totalFields = 50;

//     const filled = Object.values(formData).filter(
//       (v) => v !== "" && v !== undefined
//     ).length;

//     return (filled / totalFields) * (100 / FORM_COUNT);
//   }, [formData, FORM_COUNT]);

//   const Sel = ({ name }) => (
//     <select
//       className="input sm light px-2"
//       style={{ width: 72 }}
//       value={formData[name] ?? ""}
//       disabled={readOnly}
//       onChange={(e) => handleChange(name, e.target.value)}
//     >
//       <option value="">Select</option>
//       {CF_OPTS.map((o) => (
//         <option key={o} value={o}>
//           {o}
//         </option>
//       ))}
//     </select>
//   );

//   const Slider = ({ name }) => {
//     const value = Number(formData[name] ?? 0);

//     return (
//       <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
//         <input
//           type="range"
//           min={0}
//           max={10}
//           step={1}
//           value={value}
//          // disabled={readOnly}
//           onChange={(e) => handleChange(name, e.target.value)}
//           style={{ flex: 1 }}
//         />
//         <input
//           readOnly
//           className="input sm light px-2"
//           value={value}
//           style={{ width: 34, textAlign: "center" }}
//         />
//       </div>
//     );
//   };

//   return (
//     <div>
//       {/* Your existing table stays SAME */}
//       {/* Only Sel & Slider now use handleChange */}
//     </div>
//   );
// }




import React from "react";

export default function Form7({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange,
  FORM_COUNT = 1,
}) {
  const CF_OPTS = [0, 1, 2, 3, 4, "NA"];
  const totalFields = 51; // total fields for percent calculation

  // Stable handler for changes
  const handleChange = (name) => (e) => {
    const value = e.target.value;
    onChange({
      ...scores,
      [name]: value === "NA" ? "NA" : value === "" ? "" : Number(value),
    });
  };

  const isFieldEmpty = (name) =>
    scores[name] === undefined || scores[name] === null || scores[name] === "";

  const percentFilled =
    (Object.values(scores).filter((v) => v !== "" && v !== undefined && v !== null).length /
      totalFields) *
    (100 / FORM_COUNT);

  const isInitial = visit === "initial";

  // Slider Component
  const Slider = ({ name }) => {
    const value =
      scores[name] === "" || scores[name] === null || scores[name] === undefined
        ? 0
        : Number(scores[name]);

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={value}
            disabled={readOnly}
            onChange={handleChange(name)}
            style={{ flex: 1 }}
          />
          <input
            readOnly
            className="input sm light px-2"
            value={value}
            style={{ width: 34, textAlign: "center" }}
          />
        </div>
        {/* {!readOnly && isFieldEmpty(name) && (
          <div style={{ color: "red", fontSize: 11, marginTop: 1, textAlign: "center" }}>
            Required
          </div>
        )} */}
      </div>
    );
  };

  // Select Component
  const Sel = ({ name }) => (
    <div>
      <select
        className="input sm light px-2"
        style={{ width: 72 }}
        value={scores[name] ?? ""}
        disabled={readOnly}
        onChange={handleChange(name)}
      >
        <option value="">Select</option>
        {CF_OPTS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      {/* {!readOnly && isFieldEmpty(name) && (
        <div style={{ color: "red", fontSize: 11, marginTop: 2 }}>Required</div>
      )} */}
    </div>
  );

  return (
    <div className="form-section-wrap panel panel-default mt-4" id="form1Mdaat">
      <div className="panel-heading">
        <strong>Form MDAAT</strong>
      </div>
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? <h5>Case Presentation: Initial</h5> : <h5>Case Presentation: Follow up</h5>}
          <hr className="horizontal-rule my-2" />
          <h5>Myositis Disease Activity Assessment Tool (MDAAT)</h5>

          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th className="optional fixed-id" style={{ width: "50px" }}>S/N</th>
                    <th className="essential persist">Disease Activity</th>
                    <th className="optional">Overall Organ Disease Activity (0-10 cm) VAS</th>
                    <th className="optional">Clinical Features (0,1,2,3,4, NA: Not Assessed)</th>
                  </tr>
                </thead>
          
               <tbody>
                  {/* Constitutional Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Constitutional Disease Activity</td>
                    <td>
                      <Slider name="constitutional.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">1</td>
                    <td>Pyrexia</td>
                    <td></td>
                    <td>
                      <Sel
                        name="pyrexia.cf"
                        
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">2</td>
                    <td>Weight Loss</td>
                    <td></td>
                    <td>
                      <Sel  name="weightLoss.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">3</td>
                    <td>Fatigue</td>
                    <td></td>
                    <td>
                      <Sel  name="fatigue.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cutaneous Disease Activity</td>
                    <td>
                      <Slider name="cutaneous.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">4</td>
                    <td>Cutaneous Ulceration</td>
                    <td></td>
                    <td>
                      <Sel  name="cutaneousUlceration.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">5</td>
                    <td>Erythroderma</td>
                    <td></td>
                    <td>
                      <Sel  name="erythroderma.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">6</td>
                    <td>Panniculitis</td>
                    <td></td>
                    <td>
                      <Sel  name="panniculitis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>7</strong>
                    </td>
                    <td>
                      <strong>Erythematous Rash</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      A. with secondary changes (e.g. accompanied by erosions,
                      vesiculobullous change or necrosis)
                    </td>
                    <td></td>
                    <td>
                      <Sel  name="erythemaWithSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. without secondary changes
                    </td>
                    <td></td>
                    <td>
                      <Sel  name="erythemaNoSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">8</td>
                    <td>Heliotrope rash</td>
                    <td></td>
                    <td>
                      <Sel  name="heliotrope.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">9</td>
                    <td>Gottron's papules/sign</td>
                    <td></td>
                    <td>
                      <Sel  name="gottrons.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">10</td>
                    <td>Periungual capillary changes</td>
                    <td></td>
                    <td>
                      <Sel  name="periungualCap.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">11</td>
                    <td>Alopecia</td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">A. Diffuse hair Loss</td>
                    <td></td>
                    <td>
                      <Sel  name="diffuseHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Focal, Patchy with Erythema
                    </td>
                    <td></td>
                    <td>
                      <Sel  name="patchyHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">12</td>
                    <td>Mechanics Hand</td>
                    <td></td>
                    <td>
                      <Sel  name="mechanicsHand.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Skeletal Disease Activity</td>
                    <td>
                      <Slider name="skeletal.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>13</strong>
                    </td>
                    <td>
                      <strong>Arthritis</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      A. Severe active polyarthritis
                    </td>
                    <td></td>
                    <td>
                      <Sel name="polyarthritis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderately active arthritis
                    </td>
                    <td></td>
                    <td>
                      <Sel  name="moderateArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild arthritis</td>
                    <td></td>
                    <td>
                      <Sel  name="mildArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">14</td>
                    <td>Arthralgia</td>
                    <td></td>
                    <td>
                      <Sel  name="arthralgia.cf" />
                    </td>
                  </tr>

                  {/* GI Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>GI Disease Activity</td>
                    <td>
                      <Slider name="gi.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>15</strong>
                    </td>
                    <td>
                      <strong>Dysphagia</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      A. Moderate/severe dysphagia
                    </td>
                    <td></td>
                    <td>
                      <Sel  name="dysphagiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild dysphagia</td>
                    <td></td>
                    <td>
                      <Sel  name="dysphagiaMild.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>16</strong>
                    </td>
                    <td>
                      <strong>Abdominal Pain</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">A. Severe</td>
                    <td></td>
                    <td>
                      <Sel name="abdPainSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Moderate</td>
                    <td></td>
                    <td>
                      <Sel name="abdPainModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild</td>
                    <td></td>
                    <td>
                      <Sel  name="abdPainMild.cf" />
                    </td>
                  </tr>

                  {/* Pulmonary Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Pulmonary Disease Activity</td>
                    <td>
                      <Slider name="pulmonary.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>17</strong>
                    </td>
                    <td>
                      <strong>Resp. Muscle weakness without ILD</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">A. Dyspnea at rest</td>
                    <td></td>
                    <td>
                      <Sel  name="dyspneaRest.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Dyspnea on exertion</td>
                    <td></td>
                    <td>
                      <Sel  name="dyspneaExert.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>18</strong>
                    </td>
                    <td>
                      <strong>Active Reversible ILD</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      A. Dyspnea or cough due to ILD
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dyspneaILD.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Parenchymal abnormalities on chest x-ray or HRCT and/or
                      ground glass shadowing on HRCT
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="parenchymal.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      C. Pulmonary Function Tests: ≥ 10% change in FVC OR ≥ 15%
                      change in DLCO
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="pft.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>19</strong>
                    </td>
                    <td>
                      <strong>Dysphonia</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">A. Moderate to severe</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dysphoniaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dysphoniaMild.cf" />
                    </td>
                  </tr>

                  {/* Cardiovascular Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cardiovascular Disease Activity</td>
                    <td>
                      <Slider name="cardio.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">20</td>
                    <td>Pericarditis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="pericarditis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">21</td>
                    <td>Myocarditis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myocarditis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>22</strong>
                    </td>
                    <td>
                      <strong>Arrhythmias</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">A. Severe arrhythmia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="arrhythmiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Other arrhythmia, except sinus tachycardia
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="arrhythmiaOther.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">23</td>
                    <td>Sinus Tachycardia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="sinusTachy.cf" />
                    </td>
                  </tr>

                  {/* Other Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>
                      Other Disease Activity
                      <br />
                      <input
                        type="text"
                        className="input sm light input sm light-sm"
                        placeholder="Specify___"
                        value={scores["oda.specify"] || ""}
                        //onChange={(e) => setScores((p) => ({ ...p, ["oda.specify"]: e.target.value }))}
                        onChange={(e) =>onChange({ ...scores,["oda.specify"]: e.target.value, })}
                        disabled={readOnly}
                      />
                    </td>
                    <td>
                      <Slider name="oda.vas" />
                    </td>
                    <td>
                      <Sel opts={CF_OPTS} name="oda.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Extra Muscular Global Assessment</td>
                    <td>
                      <Slider name="extraMuscular.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Muscle Disease Activity</td>
                    <td>
                      <Slider name="muscle.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">
                      <strong>24</strong>
                    </td>
                    <td>
                      <strong>Myositis</strong>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      A. Severe muscle inflammation
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myositisSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderate muscle inflammation
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myositisModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild muscle inflammation</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myositisMild.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">25</td>
                    <td>Myalgia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myalgia.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Global Disease Activity</td>
                    <td>
                      <Slider name="global.vas" />
                    </td>
                    <td></td>
                  </tr>
                </tbody>



            
                  {/* Continue adding remaining fields similarly */}
                
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







































// import { useCallback } from "react";

// export default function Form7({
//   visit = "initial",
//   readOnly = false,
//   formData = {},
//   setFormData,
// }) {



//   const handleChange = useCallback((name, value) => {
//   setFormData((prev) => {
//     const keys = name.split(".");
//     const newData = { ...prev };

//     let current = newData;
//     for (let i = 0; i < keys.length - 1; i++) {
//       current[keys[i]] = current[keys[i]] || {};
//       current = current[keys[i]];
//     }

//     current[keys[keys.length - 1]] =
//       value === "NA" ? "NA" : value === "" ? "" : Number(value);

//     return newData;
//   });
// }, [setFormData]);


//   const CF_OPTS = [0, 1, 2, 3, 4, "NA"];


//   const Sel = ({ name }) => (
//     <select
//       className="input sm light px-2"
//       style={{ width: 72 }}
//       value={formData[name] ?? ""}
//       disabled={readOnly}
//       onChange={(e) => handleChange(name, e.target.value)}
//     >
//       <option value="">Select</option>
//       {CF_OPTS.map((o) => (
//         <option key={o} value={o}>
//           {o}
//         </option>
//       ))}
//     </select>
//   );

 
//   const Slider = ({ name }) => {
//     const value = formData[name] ?? 0;
 

//     return (
//       <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//         <input
//           type="range"
//           min={0}
//           max={10}
//           step={1}
//           value={value}
//           disabled={readOnly}
//           onChange={(e) => handleChange(name, e.target.value)}
//           style={{ flex: 1 }}
//         />

//         <input
//           readOnly
//           className="input sm light px-2"
//           value={value}
//           style={{ width: 35, textAlign: "center" }}
//         />
//       </div>
//     );
//   };

//   const isInitial = visit === "initial";

//   return (
//     <div className="form-section-wrap panel panel-default mt-4">
//       <div className="panel-heading">
//         <strong>Form MDAAT</strong>
//       </div>

//       <div className="panel-body mt-3 text-center">
//         {isInitial ? (
//           <h5>Case Presentation: Initial</h5>
//         ) : (
//           <h5>Case Presentation: Follow up</h5>
//         )}

//         <hr />

//         <h5>Myositis Disease Activity Assessment Tool (MDAAT)</h5>


//         <table className="table theme-table bdr mt-3">
//           <thead>
//             <tr>
//               <th>S/N</th>
//               <th>Disease Activity</th>
//               <th>Overall Organ Disease Activity (0-10 cm) VAS</th>
//               <th>Clinical Features (0,1,2,3,4, NA: Not Assessed)</th>
//             </tr>
//           </thead>

//           <tbody>

//             {/* Constitutional */}
//             <tr>
//               <td></td>
//               <td>Constitutional Disease Activity</td>
//               <td>
//                 <Slider name="constitutional.vas" />
//               </td>
//               <td></td>
//             </tr>

//             <tr>
//               <td>1</td>
//               <td>Pyrexia</td>
//               <td></td>
//               <td>
//                 <Sel name="pyrexia.cf" />
//               </td>
//             </tr>

//             <tr>
//               <td>2</td>
//               <td>Weight Loss</td>
//               <td></td>
//               <td>
//                 <Sel name="weightLoss.cf" />
//               </td>
//             </tr>

//             {/* Cutaneous */}
//             <tr>
//               <td></td>
//               <td>Cutaneous Disease Activity</td>
//               <td>
//                 <Slider name="cutaneous.vas" />
//               </td>
//               <td></td>
//             </tr>

//             <tr>
//               <td>4</td>
//               <td>Cutaneous Ulceration</td>
//               <td></td>
//               <td>
//                 <Sel name="cutaneousUlceration.cf" />
//               </td>
//             </tr>



           
//           </tbody>
//         </table>

//       </div>
//     </div>
//   );
// }
