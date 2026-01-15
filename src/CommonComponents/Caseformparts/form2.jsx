
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form2 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  // let snCounter = 1;
  // const nextSn = () => snCounter++;
  const getDisplayName = (key) => {
    const displayNames = {
      "V‑area Neck (Frontal)": "V - area Neck (Frontal)"
    };
    return displayNames[key] || key;
  };

  const LOCATIONS = [
    "Scalp", "Malar Area", "Periorbital", "Rest of the Face",
    "V‑area Neck (Frontal)", "Posterior Neck", "Upper Back & Shoulders",
    "Rest of Back & Buttocks", "Abdomen", "Lateral Upper Thigh",
    "Rest of Leg & Feet", "Arm", "Mechanic's Hand",
    "Dorsum of Hands (Not Over Joints)", "Gottron's - Not on Hands"
  ];

  return (
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap={false}>
      <View style={{ marginBottom: 10 }}>

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
          <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
            Cutaneous Dermatomyositis Disease Area and Severity Index (CDASI)
          </Text>
          {/* <Text style={{ fontSize: 12 }}>CDASI Damage</Text> */}
        </View>

        <Text
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: 8,
            borderRadius: 4,
            border: '1px solid #218838',
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 7,
          }}
        >
          CDASI Activity
        </Text>

        <View style={[styles.table, { marginTop: 7, backgroundColor: "#D3D3D3" }]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {/* <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>S/N</Text> */}
            <Text style={styles.tableCell}>Anatomical Location</Text>
            <Text style={styles.tableCell}>Erythema</Text>
            <Text style={styles.tableCell}>Scale</Text>
            <Text style={styles.tableCell}>Erosion/Ulceration</Text>
          </View>

          <View style={[styles.tableRow, { backgroundColor: "#D3D3D3" }]}>

            <Text style={[styles.tableCell, { fontSize: 10 }]}></Text>
            <Text style={[styles.tableCell, { fontSize: 10 }]}>
              0 - absent{"\n"}
              1 - pink; faint erythema{"\n"}
              2 - red{"\n"}
              3 - dark red
            </Text>
            <Text style={[styles.tableCell, { fontSize: 10 }]}>
              0 - absent{"\n"}
              1 - scale{"\n"}
              2 - crust; lichenification
            </Text>
            <Text style={[styles.tableCell, { fontSize: 10 }]}>
              0 - absent{"\n"}
              1 - present
            </Text>
          </View>
        </View>

        {LOCATIONS.map((loc) => (
          <View key={loc} style={styles.tableRow}>
            {/* <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>{nextSn()}</Text> */}
            <Text style={styles.tableCell}>{getDisplayName(loc)}</Text>
            <Text style={styles.tableCell}>{data[`${loc}.erythema`] || "-"}</Text>
            <Text style={styles.tableCell}>{data[`${loc}.scale`] || "-"}</Text>
            <Text style={styles.tableCell}>{data[`${loc}.erosion`] || "-"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Form2;


