import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form3 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  // let snCounter = 1;
  // const nextSn = () => snCounter++;

  const DAMAGE_LOCATIONS = [
    "Scalp", "Malar Area", "Periorbital", "Rest of the Face",
    "V - area Neck (Frontal)", "Posterior Neck", "Upper Back & Shoulders",
    "Rest of Back & Buttocks", "Abdomen", "Lateral Upper Thigh",
    "Rest of Leg and feet", "Arm", "Mechanic's Hand",
    "Dorsums of hands (Not Over Joints)", "Gottron's - Not on Hands"
  ];

  return (
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap={false}>

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
        <Text style={{ fontSize: 12 }}>CDASI Damage</Text>
      </View>

      <View
        style={{
          backgroundColor: '#e71f1f',
          color: 'white',
          padding: 8,
          borderRadius: 4,
          border: '2px solid #fe0000',
          textAlign: 'center',
          marginBottom: 7,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>CDASI Damage</Text>
      </View>

      {/* Table */}
      <View style={[styles.table]}>
        {/* Table Header Row */}
        <View style={[styles.tableRow, styles.tableHeader, , { backgroundColor: "#D3D3D3" }]}>
          {/* <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>S/N</Text> */}
          <Text style={styles.tableCell}>Anatomical Location</Text>
          <Text style={styles.tableCell}>Poikiloderma</Text>
          <Text style={styles.tableCell}>Calcinosis</Text>
        </View>

        {/* Table Data Rows */}
        {DAMAGE_LOCATIONS.map((loc) => (
          <View key={loc} style={styles.tableRow} wrap={false}>
            {/* <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>S/N</Text> */}
            <Text style={styles.tableCell}>{loc}</Text>
            <Text style={styles.tableCell}>{data[`${loc}.poikilo`] || "-"}</Text>
            <Text style={styles.tableCell}>{data[`${loc}.calcinosis`] || "-"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Form3;
