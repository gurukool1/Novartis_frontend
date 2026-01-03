import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const PAGE_X = 32;

const color = {
  brand: "rgb(11, 87, 208)",
  brandBorder: "#1f22e7",
  tableBorder: "#d9d9d9",
  text: "#111",
  sub: "#555",
};


const SnCell = ({ children }) => (
  <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>{children}</Text>
);

const LabelCell = ({ children }) => (
  <Text style={[styles.tableCell, { flex: 3 }]}>{children}</Text>
);

const VasCell = ({ children }) => (
  <View style={[styles.tableCell, { flex: 1.2, alignItems: 'flex-start' }]}>{children}</View>
);

const CfCell = ({ children }) => (
  <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{children}</Text>
);


function HeaderRow() {
  return (
    <View style={[styles.tableRow, styles.tableHeader, { marginTop: 7, backgroundColor: "#D3D3D3" }]}>
      <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>S/N</Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>Disease Activity</Text>
      <Text style={[styles.tableCell, { flex: 1.2 }]}>
        Overall Organ Disease Activity (0–10 cm) VAS
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
        Clinical Features (0,1,2,3,4, NA)
      </Text>
    </View>
  );
}

function SectionVasRow({ label, vasValue }) {
  return (
    <View style={styles.tableRow}>
      <SnCell>{""}</SnCell>
      <LabelCell><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{label}</Text></LabelCell>
      <VasCell><Text>{vasValue}</Text></VasCell>
      <CfCell>{""}</CfCell>
    </View>
  );
}

function CfRow({ sn, label, cfValue }) {
  return (
    <View style={styles.tableRow}>
      <SnCell>{sn ?? ""}</SnCell>
      <LabelCell><Text>{label}</Text></LabelCell>
      {/* <LabelCell><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{label}</Text></LabelCell> */}
      <VasCell>{""}</VasCell>
      <CfCell>{cfValue ?? ""}</CfCell>
    </View>
  );
}

function ParentLabelRow({ sn, label }) {
  return (
    <View style={styles.tableRow}>
      <SnCell><Text style={styles.sectionTitle}>{sn ?? ""}</Text></SnCell>
      {/* <LabelCell><Text style={styles.sectionTitle}>{label}</Text></LabelCell> */}
      <LabelCell><Text>{label}</Text></LabelCell>
      <VasCell>{""}</VasCell>
      <CfCell>{""}</CfCell>
    </View>
  );
}


function SubCfRow({ label, cfValue }) {
  return (
    <View style={styles.tableRow}>
      <SnCell>{""}</SnCell>
      {/* <LabelCell><Text style={styles.subHeader}>• {label}</Text></LabelCell> */}
      <LabelCell><Text style={{ fontSize: 9, fontWeight: 'bold' }}>•{label}</Text></LabelCell>
      <VasCell>{""}</VasCell>
      <CfCell>{cfValue ?? ""}</CfCell>
    </View>
  );
}

function CombinedRow({ sn, label, vasValue, cfValue }) {
  return (
    <View style={styles.tableRow}>
      <SnCell>{sn ?? ""}</SnCell>
      <LabelCell><Text>{label}</Text></LabelCell>
      <VasCell><Text>{vasValue}</Text></VasCell>
      <CfCell>{cfValue ?? ""}</CfCell>
    </View>
  );
}

// Main Component
export default function FormMDAATPdf({
  data = {},
  visit = "initial",
  breakAfter = false, // let caller choose pagination
}) {

  let snCounter = 1;
  const nextSn = () => snCounter++;
  // Read the same keys your web version writes: "*.vas" and "*.cf"
  const V = (k) => data[k] || ""; // raw string for CF or VAS
  const Nv = (k) => Number(data[k] || 0); // numeric for VAS

  const getOtherDiseaseLabel = () => {
    const specify = V("oda.specify");
    if (specify && specify.trim() !== "") {
      return (
        <Text>
          Other Disease Activity{"\n"}
          <Text style={{ fontWeight: "bold" }}>{specify}</Text>
        </Text>
      )

    }
    return <Text>Other Disease Activity</Text>;
  };

  return (
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap>
      <View
        style={{
          // backgroundColor: '#1f22e7ff',
          backgroundColor: "rgb(11, 87,208)",
          color: 'white',
          padding: 4,
          borderRadius: 4,
          border: '2px solid #1f22e7ff',
          //textAlign: 'center',
          marginBottom: 7,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
          Case Presentation: {visit === 'initial' ? 'Initial' : 'Follow up'}
        </Text>
        {/* <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
          Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI)
        </Text> */}
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Myositis Disease Activity Assessment Tool (MDAAT)</Text>

        {/* <Text style={{ fontSize: 12 }}>CDASI Damage</Text> */}
      </View>

      {/* <View style={[styles.table, { marginTop: 7, backgroundColor: "#D3D3D3" }]}> */}
      <View style={styles.table}>
        <HeaderRow />

        {/* Constitutional */}
        <SectionVasRow label="Constitutional Disease Activity" vasValue={Nv("constitutional.vas")} />
        <CfRow sn={nextSn()} label="Pyrexia" cfValue={V("pyrexia.cf")} />
        <CfRow sn={nextSn()} label="Weight Loss" cfValue={V("weightLoss.cf")} />
        <CfRow sn={nextSn()} label="Fatigue" cfValue={V("fatigue.cf")} />

        {/* Cutaneous */}
        <SectionVasRow label="Cutaneous Disease Activity" vasValue={Nv("cutaneous.vas")} />
        <CfRow sn={nextSn()} label="Cutaneous Ulceration" cfValue={V("cutaneousUlceration.cf")} />
        <CfRow sn={nextSn()} label="Erythroderma" cfValue={V("erythroderma.cf")} />
        <CfRow sn={nextSn()} label="Panniculitis" cfValue={V("panniculitis.cf")} />
        <ParentLabelRow sn={nextSn()} label="Erythematous Rash" />

        <SubCfRow label="A. with secondary changes" cfValue={V("erythemaWithSec.cf")} />
        <SubCfRow label="B. without secondary changes" cfValue={V("erythemaNoSec.cf")} />
        <CfRow sn={nextSn()} label="Heliotrope rash" cfValue={V("heliotrope.cf")} />
        <CfRow sn={nextSn()} label="Gottron's papules/sign" cfValue={V("gottrons.cf")} />
        <CfRow sn={nextSn()} label="Periungual capillary changes" cfValue={V("periungualCap.cf")} />
        <CfRow sn={nextSn()} style={{ fontSize: 11, fontWeight: 'bold' }} label="Alopecia" cfValue={""} />
        <SubCfRow label="A. Diffuse hair loss" cfValue={V("diffuseHair.cf")} />
        <SubCfRow label="B. Focal, Patchy with Erythema" cfValue={V("patchyHair.cf")} />
        <CfRow sn={nextSn()} label="Mechanics Hand" cfValue={V("mechanicsHand.cf")} />

        {/* Skeletal */}
        <SectionVasRow label="Skeletal Disease Activity" vasValue={Nv("skeletal.vas")} />
        <ParentLabelRow sn={nextSn()} label="Arthritis" />
        <SubCfRow label="A. Severe active polyarthritis" cfValue={V("polyarthritis.cf")} />
        <SubCfRow label="B. Moderately active arthritis" cfValue={V("moderateArth.cf")} />
        <SubCfRow label="C. Mild arthritis" cfValue={V("mildArth.cf")} />
        <CfRow sn={nextSn()} label="Arthralgia" cfValue={V("arthralgia.cf")} />

        {/* GI */}
        <SectionVasRow label="GI Disease Activity" vasValue={Nv("gi.vas")} />
        <ParentLabelRow sn={nextSn()} label="Dysphagia" />
        <SubCfRow label="A. Moderate/severe dysphagia" cfValue={V("dysphagiaSevere.cf")} />
        <SubCfRow label="B. Mild dysphagia" cfValue={V("dysphagiaMild.cf")} />
        <ParentLabelRow sn={nextSn()} label="Abdominal Pain" />
        <SubCfRow label="A. Severe" cfValue={V("abdPainSevere.cf")} />
        <SubCfRow label="B. Moderate" cfValue={V("abdPainModerate.cf")} />
        <SubCfRow label="C. Mild" cfValue={V("abdPainMild.cf")} />

        {/* Pulmonary */}
        <SectionVasRow label="Pulmonary Disease Activity" vasValue={Nv("pulmonary.vas")} />
        {/* <ParentLabelRow sn={nextSn()} style={{ fontSize: 11, fontWeight: 'bold' }} label="Resp. Muscle weakness without ILD" /> */}
        <ParentLabelRow sn={nextSn()} label="Resp. Muscle weakness without ILD" />

        <SubCfRow label="A. Dyspnea at rest" cfValue={V("dyspneaRest.cf")} />
        <SubCfRow label="B. Dyspnea on exertion" cfValue={V("dyspneaExert.cf")} />
        <ParentLabelRow sn={nextSn()} label="Active Reversible ILD" />
        <SubCfRow label="A. Dyspnea or cough due to ILD" cfValue={V("dyspneaILD.cf")} />
        <SubCfRow label="B. Parenchymal abnormalities" cfValue={V("parenchymal.cf")} />
        <SubCfRow label="C. Pulmonary Function Tests" cfValue={V("pft.cf")} />
        <ParentLabelRow sn={nextSn()} label="Dysphonia" />
        <SubCfRow label="A. Moderate to severe" cfValue={V("dysphoniaSevere.cf")} />
        <SubCfRow label="B. Mild" cfValue={V("dysphoniaMild.cf")} />

        {/* Cardio */}
        <SectionVasRow label="Cardiovascular Disease Activity" vasValue={Nv("cardio.vas")} />
        <CfRow sn={nextSn()} label="Pericarditis" cfValue={V("pericarditis.cf")} />
        <CfRow sn={nextSn()} label="Myocarditis" cfValue={V("myocarditis.cf")} />
        <ParentLabelRow sn={nextSn()} label="Arrhythmias" />
        <SubCfRow label="A. Severe arrhythmia" cfValue={V("arrhythmiaSevere.cf")} />
        <SubCfRow label="B. Other arrhythmia (except sinus tachycardia)" cfValue={V("arrhythmiaOther.cf")} />
        <CfRow sn={nextSn()} label="Sinus Tachycardia" cfValue={V("sinusTachy.cf")} />

        {/* Other / Globals */}
        {/* <SectionVasRow label="Other Disease Activity" vasValue={Nv("oda.vas")} />
        <CfRow label="(Specify in web form)" cfValue={V("oda.cf")} /> */}

        <CombinedRow
          // sn={nextSn()}
          label={getOtherDiseaseLabel()}
          vasValue={Nv("oda.vas")}
          cfValue={V("oda.cf")}
        />
        <SectionVasRow label="Extra Muscular Global Assessment" vasValue={Nv("extraMuscular.vas")} />
        <SectionVasRow label="Muscle Disease Activity" vasValue={Nv("muscle.vas")} />
        <ParentLabelRow sn={nextSn()} label="Myositis" />
        <SubCfRow label="A. Severe muscle inflammation" cfValue={V("myositisSevere.cf")} />
        <SubCfRow label="B. Moderate muscle inflammation" cfValue={V("myositisModerate.cf")} />
        <SubCfRow label="C. Mild muscle inflammation" cfValue={V("myositisMild.cf")} />
        <CfRow sn={nextSn()} label="Myalgia" cfValue={V("myalgia.cf")} />
        <SectionVasRow label="Global Disease Activity" vasValue={Nv("global.vas")} />
      </View>
    </View>
  );
}




















// import React from 'react';
// import { View, Text } from '@react-pdf/renderer';
// import { styles } from '../PdfStyles';

// const PAGE_X = 32;

// const color = {
//   brand: "rgb(11, 87, 208)",
//   brandBorder: "#1f22e7",
//   tableBorder: "#d9d9d9",
//   text: "#111",
//   sub: "#555",
// };

// const SnCell = ({ children }) => (
//   <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>{children}</Text>
// );

// const LabelCell = ({ children }) => (
//   <Text style={[styles.tableCell, { flex: 3 }]}>{children}</Text>
// );

// const VasCell = ({ children }) => (
//   <View style={[styles.tableCell, { flex: 1.2, alignItems: 'flex-start' }]}>{children}</View>
// );

// const CfCell = ({ children }) => (
//   <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{children}</Text>
// );

// function HeaderRow() {
//   return (
//     <View style={[styles.tableRow, styles.tableHeader, { marginTop: 7, backgroundColor: "#D3D3D3" }]}>
//       <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>S/N</Text>
//       <Text style={[styles.tableCell, { flex: 3 }]}>Disease Activity</Text>
//       <Text style={[styles.tableCell, { flex: 1.2 }]}>
//         Overall Organ Disease Activity (0–10 cm) VAS
//       </Text>
//       <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
//         Clinical Features (0,1,2,3,4, NA)
//       </Text>
//     </View>
//   );
// }

// function SectionVasRow({ label, vasValue }) {
//   return (
//     <View style={styles.tableRow}>
//       <SnCell>{""}</SnCell>
//       <LabelCell><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{label}</Text></LabelCell>
//       <VasCell><Text>{vasValue}</Text></VasCell>
//       <CfCell>{""}</CfCell>
//     </View>
//   );
// }

// function CfRow({ sn, label, cfValue }) {
//   return (
//     <View style={styles.tableRow}>
//       <SnCell>{sn ?? ""}</SnCell>
//       <LabelCell><Text>{label}</Text></LabelCell>
//       <VasCell>{""}</VasCell>
//       <CfCell>{cfValue ?? ""}</CfCell>
//     </View>
//   );
// }

// // NEW: Combined row for VAS and CF in the same row (like in the image)
// function CombinedRow({ sn, label, vasValue, cfValue }) {
//   return (
//     <View style={styles.tableRow}>
//       <SnCell>{sn ?? ""}</SnCell>
//       <LabelCell><Text>{label}</Text></LabelCell>
//       <VasCell><Text>{vasValue}</Text></VasCell>
//       <CfCell>{cfValue ?? ""}</CfCell>
//     </View>
//   );
// }

// function ParentLabelRow({ sn, label }) {
//   return (
//     <View style={styles.tableRow}>
//       <SnCell><Text style={styles.sectionTitle}>{sn ?? ""}</Text></SnCell>
//       <LabelCell><Text>{label}</Text></LabelCell>
//       <VasCell>{""}</VasCell>
//       <CfCell>{""}</CfCell>
//     </View>
//   );
// }

// function SubCfRow({ label, cfValue }) {
//   return (
//     <View style={styles.tableRow}>
//       <SnCell>{""}</SnCell>
//       <LabelCell><Text style={{ fontSize: 9, fontWeight: 'bold' }}>•{label}</Text></LabelCell>
//       <VasCell>{""}</VasCell>
//       <CfCell>{cfValue ?? ""}</CfCell>
//     </View>
//   );
// }

// // Main Component
// export default function FormMDAATPdf({
//   data = {},
//   visit = "initial",
//   breakAfter = false,
// }) {

//   let snCounter = 1;
//   const nextSn = () => snCounter++;
//   const V = (k) => data[k] || ""; // raw string for CF or VAS
//   const Nv = (k) => Number(data[k] || 0); // numeric for VAS

//   // Get the specify text and format the label
//   const getOtherDiseaseLabel = () => {
//     const specify = V("oda.specify");
//     if (specify && specify !== "None" && specify.trim() !== "") {
//       return `Other Disease Activity ${specify}`;
//     }
//     return "Other Disease Activity";
//   };

//   return (
//     <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap>
//       <View
//         style={{
//           backgroundColor: "rgb(11, 87,208)",
//           color: 'white',
//           padding: 4,
//           borderRadius: 4,
//           border: '2px solid #1f22e7ff',
//           marginBottom: 7,
//         }}
//       >
//         <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
//           Case Presentation: {visit === 'initial' ? 'Initial' : 'Follow up'}
//         </Text>
//         <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Myositis Disease Activity Assessment Tool (MDAAT)</Text>
//       </View>

//       <View style={styles.table}>
//         <HeaderRow />

//         {/* Constitutional */}
//         <SectionVasRow label="Constitutional Disease Activity" vasValue={Nv("constitutional.vas")} />
//         <CfRow sn={nextSn()} label="Pyrexia" cfValue={V("pyrexia.cf")} />
//         <CfRow sn={nextSn()} label="Weight Loss" cfValue={V("weightLoss.cf")} />
//         <CfRow sn={nextSn()} label="Fatigue" cfValue={V("fatigue.cf")} />

//         {/* Cutaneous */}
//         <SectionVasRow label="Cutaneous Disease Activity" vasValue={Nv("cutaneous.vas")} />
//         <CfRow sn={nextSn()} label="Cutaneous Ulceration" cfValue={V("cutaneousUlceration.cf")} />
//         <CfRow sn={nextSn()} label="Erythroderma" cfValue={V("erythroderma.cf")} />
//         <CfRow sn={nextSn()} label="Panniculitis" cfValue={V("panniculitis.cf")} />
//         <ParentLabelRow sn={nextSn()} label="Erythematous Rash" />

//         <SubCfRow label="A. with secondary changes" cfValue={V("erythemaWithSec.cf")} />
//         <SubCfRow label="B. without secondary changes" cfValue={V("erythemaNoSec.cf")} />
//         <CfRow sn={nextSn()} label="Heliotrope rash" cfValue={V("heliotrope.cf")} />
//         <CfRow sn={nextSn()} label="Gottron's papules/sign" cfValue={V("gottrons.cf")} />
//         <CfRow sn={nextSn()} label="Periungual capillary changes" cfValue={V("periungualCap.cf")} />
//         <CfRow sn={nextSn()} style={{ fontSize: 11, fontWeight: 'bold' }} label="Alopecia" cfValue={""} />
//         <SubCfRow label="A. Diffuse hair loss" cfValue={V("diffuseHair.cf")} />
//         <SubCfRow label="B. Focal, Patchy with Erythema" cfValue={V("patchyHair.cf")} />
//         <CfRow sn={nextSn()} label="Mechanics Hand" cfValue={V("mechanicsHand.cf")} />

//         {/* Skeletal */}
//         <SectionVasRow label="Skeletal Disease Activity" vasValue={Nv("skeletal.vas")} />
//         <ParentLabelRow sn={nextSn()} label="Arthritis" />
//         <SubCfRow label="A. Severe active polyarthritis" cfValue={V("polyarthritis.cf")} />
//         <SubCfRow label="B. Moderately active arthritis" cfValue={V("moderateArth.cf")} />
//         <SubCfRow label="C. Mild arthritis" cfValue={V("mildArth.cf")} />
//         <CfRow sn={nextSn()} label="Arthralgia" cfValue={V("arthralgia.cf")} />

//         {/* GI */}
//         <SectionVasRow label="GI Disease Activity" vasValue={Nv("gi.vas")} />
//         <ParentLabelRow sn={nextSn()} label="Dysphagia" />
//         <SubCfRow label="A. Moderate/severe dysphagia" cfValue={V("dysphagiaSevere.cf")} />
//         <SubCfRow label="B. Mild dysphagia" cfValue={V("dysphagiaMild.cf")} />
//         <ParentLabelRow sn={nextSn()} label="Abdominal Pain" />
//         <SubCfRow label="A. Severe" cfValue={V("abdPainSevere.cf")} />
//         <SubCfRow label="B. Moderate" cfValue={V("abdPainModerate.cf")} />
//         <SubCfRow label="C. Mild" cfValue={V("abdPainMild.cf")} />

//         {/* Pulmonary */}
//         <SectionVasRow label="Pulmonary Disease Activity" vasValue={Nv("pulmonary.vas")} />
//         <ParentLabelRow sn={nextSn()} label="Resp. Muscle weakness without ILD" />

//         <SubCfRow label="A. Dyspnea at rest" cfValue={V("dyspneaRest.cf")} />
//         <SubCfRow label="B. Dyspnea on exertion" cfValue={V("dyspneaExert.cf")} />
//         <ParentLabelRow sn={nextSn()} label="Active Reversible ILD" />
//         <SubCfRow label="A. Dyspnea or cough due to ILD" cfValue={V("dyspneaILD.cf")} />
//         <SubCfRow label="B. Parenchymal abnormalities" cfValue={V("parenchymal.cf")} />
//         <SubCfRow label="C. Pulmonary Function Tests" cfValue={V("pft.cf")} />
//         <ParentLabelRow sn={nextSn()} label="Dysphonia" />
//         <SubCfRow label="A. Moderate to severe" cfValue={V("dysphoniaSevere.cf")} />
//         <SubCfRow label="B. Mild" cfValue={V("dysphoniaMild.cf")} />

//         {/* Cardio */}
//         <SectionVasRow label="Cardiovascular Disease Activity" vasValue={Nv("cardio.vas")} />
//         <CfRow sn={nextSn()} label="Pericarditis" cfValue={V("pericarditis.cf")} />
//         <CfRow sn={nextSn()} label="Myocarditis" cfValue={V("myocarditis.cf")} />
//         <ParentLabelRow sn={nextSn()} label="Arrhythmias" />
//         <SubCfRow label="A. Severe arrhythmia" cfValue={V("arrhythmiaSevere.cf")} />
//         <SubCfRow label="B. Other arrhythmia (except sinus tachycardia)" cfValue={V("arrhythmiaOther.cf")} />
//         <CfRow sn={nextSn()} label="Sinus Tachycardia" cfValue={V("sinusTachy.cf")} />

//         {/* Other / Globals - UPDATED */}
//         {/* Use CombinedRow for Other Disease Activity to show both VAS and CF in same row */}
//         <CombinedRow
//           sn={nextSn()}
//           label={getOtherDiseaseLabel()}
//           vasValue={Nv("oda.vas")}
//           cfValue={V("oda.cf")}
//         />

//         <SectionVasRow label="Extra Muscular Global Assessment" vasValue={Nv("extraMuscular.vas")} />
//         <SectionVasRow label="Muscle Disease Activity" vasValue={Nv("muscle.vas")} />
//         <ParentLabelRow sn={nextSn()} label="Myositis" />
//         <SubCfRow label="A. Severe muscle inflammation" cfValue={V("myositisSevere.cf")} />
//         <SubCfRow label="B. Moderate muscle inflammation" cfValue={V("myositisModerate.cf")} />
//         <SubCfRow label="C. Mild muscle inflammation" cfValue={V("myositisMild.cf")} />
//         <CfRow sn={nextSn()} label="Myalgia" cfValue={V("myalgia.cf")} />
//         <SectionVasRow label="Global Disease Activity" vasValue={Nv("global.vas")} />
//       </View>
//     </View>
//   );
// }