import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';
// const styles = StyleSheet.create({
//   section: {
//     marginBottom: 12,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     marginVertical: 4,
//   },
//   table: {
//     display: 'table',
//     width: '100%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableCell: {
//     padding: 4,
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//     flex: 1,
//     fontSize: 9,
//   },
//   tableHeader: {
//     backgroundColor: '#f0f0f0',
//     fontWeight: 'bold',
//   },
//   subHeaderRow: {
//     backgroundColor: '#e0e0e0',
//   },
//   subHeaderText: {
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 10,
//     padding: 4,
//     flex: 1,
//   },
//   wideCell: {
//     flex: 3,
//   },
// });

const Form1 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  // Summary calculation
  const summary = { perSide: { right: 0, left: 0, axial: 0 } };
  Object.entries(data).forEach(([key, value]) => {
    if (!value || value === "NA") return;
    const [, side] = key.split(".");
    if (side in summary.perSide) {
      summary.perSide[side] += Number(value);
    }
  });
  summary.total = summary.perSide.right + summary.perSide.left + summary.perSide.axial;

  return (
    <View style={styles.section} wrap={false}>

      <View
        style={{
          // backgroundColor: '#1f22e7ff',
          backgroundColor: "rgb(11, 87,208)",
          color: 'white',
          padding: 4,
          borderRadius: 4,
          border: '2px solid #1f22e7ff',
          //textAlign: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
          Case Presentation: {visit === 'initial' ? 'Initial' : 'Follow up'}
        </Text>
        {/* <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
            Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI)
          </Text> */}
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}  >
          {visit === 'initial'
            ? 'Manual Muscle Testing‑8 (MMT‑8)'
            : "Answers with possible correct responses based on patient's examination in the case."}
        </Text>

        {/* <Text style={{ fontSize: 12 }}>CDASI Damage</Text> */}
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: "#D3D3D3" }]}>
          <Text style={styles.tableCell}>Muscle Group</Text>
          <Text style={styles.tableCell}>Right (0–10)</Text>
          <Text style={styles.tableCell}>Left (0–10)</Text>
          <Text style={styles.tableCell}>Axial (0–10)</Text>
        </View>

        {/* Axial Muscle */}
        <View style={[styles.tableRow, styles.subHeaderRow, { backgroundColor: "#ffebee", fontWeight: 'bold' }]}>
          <Text style={styles.subHeaderText}>Axial Muscle</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Neck Flexor</Text>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>{data["Neck Flexor.axial"] || "-"}</Text>
        </View>

        {/* Proximal Muscles */}
        <View style={[styles.tableRow, styles.subHeaderRow, { backgroundColor: "#ffebee", fontWeight: 'bold', }]}>
          <Text style={styles.subHeaderText}>Proximal Muscles</Text>
        </View>
        {['Deltoid', 'Biceps', 'Quadriceps', 'Gluteus Medius', 'Gluteus Maximus'].map((muscle) => (
          <View key={muscle} style={styles.tableRow}>
            <Text style={styles.tableCell}>{muscle}</Text>
            <Text style={styles.tableCell}>{data[`${muscle}.right`] || "-"}</Text>
            <Text style={styles.tableCell}>{data[`${muscle}.left`] || "-"}</Text>
            <Text style={styles.tableCell}>-</Text>
          </View>
        ))}

        {/* Distal Muscles */}
        <View style={[styles.tableRow, styles.subHeaderRow, { backgroundColor: "#ffebee", fontWeight: 'bold', }]}>
          <Text style={styles.subHeaderText}>Distal Muscles</Text>
        </View>
        {['Wrist Extensor', 'Ankle Dorsiflexion'].map((muscle) => (
          <View key={muscle} style={styles.tableRow}>
            <Text style={styles.tableCell}>{muscle}</Text>
            <Text style={styles.tableCell}>{data[`${muscle}.right`] || "-"}</Text>
            <Text style={styles.tableCell}>{data[`${muscle}.left`] || "-"}</Text>
            <Text style={styles.tableCell}>-</Text>
          </View>
        ))}

        {/* MMT-8 Scoring */}
        <View style={[styles.tableRow, styles.subHeaderRow, { backgroundColor: "#ffebee", fontWeight: 'bold', }]}>
          <Text style={styles.subHeaderText}>MMT-8 Scoring</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Individual Score</Text>
          <Text style={styles.tableCell}>{summary.perSide.right}</Text>
          <Text style={styles.tableCell}>{summary.perSide.left}</Text>
          <Text style={styles.tableCell}>{summary.perSide.axial}</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: "#ffebee", fontWeight: 'bold', }]}>
          <Text style={styles.tableCell}>Total Score</Text>
          <Text style={[styles.tableCell, styles.wideCell]}>{summary.total}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Maximum Individual Possible Score</Text>
          <Text style={styles.tableCell}>70</Text>
          <Text style={styles.tableCell}>70</Text>
          <Text style={styles.tableCell}>10</Text>
        </View>
        <View style={[styles.tableRow, { fontWeight: 'bold', backgroundColor: '#c6eaf1ff' }]}>
          <Text style={styles.tableCell}>Maximum Total Possible Score</Text>
          <Text style={[styles.tableCell, styles.wideCell]}>150</Text>
        </View>
      </View>
    </View>
  );
};

export default Form1;
