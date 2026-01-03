import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form4 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  return (
    <View style={styles.section}>
      <View style={styles.table}>

        {/* Section Title */}
        <View style={[styles.tableRow, { backgroundColor: "rgb(11, 87,208)", color: '#fff', marginBottom: 7 }]}>
          <Text style={[styles.tableCell, { fontSize: 11 }]} colSpan={3}>
            Gottron's, Periungual, Alopecia Assessment
          </Text>
        </View>

        {/* Table Title */}
        <View style={[styles.tableRow, { backgroundColor: "rgb(11, 87,208)", color: '#fff' }]}>
          <Text style={[styles.tableCell, { textAlign: 'center', fontSize: 14 }]} colSpan={3}>
            Gottron's – Hands
          </Text>
        </View>

        {/* Column Headers */}
        <View style={[styles.tableRow, { backgroundColor: "#D3D3D3" }]}>
          <View style={[styles.tableCell, { flex: 2.5, borderRightWidth: 1, borderRightColor: '#fff' }]}>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>
              Examine the patient's hands and double score if papules are present
            </Text>
          </View>
          <View style={[styles.tableCell, { flex: 1, borderRightWidth: 1, borderRightColor: '#fff' }]}>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>
              Ulceration
            </Text>
          </View>
          <View style={[styles.tableCell, { flex: 2.5 }]}>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>
              Examine patient's hands and score if damage is present
            </Text>
          </View>
        </View>

        {/* Content Row */}
        <View style={styles.tableRow}>
          {/* First Column - Examination */}
          <View style={[styles.tableCell, { flex: 2.5, borderRightWidth: 1, borderRightColor: '#fff', flexDirection: 'row' }]}>
            {/* Left: Legend */}
            <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#D3D3D3', paddingRight: 5 }}>
              <Text style={{ fontSize: 9, fontWeight: 600 }}>
                0 - absent{"\n"}
                1 - pink; faint erythema{"\n"}
                2 - red erythema{"\n"}
                3 - dark red
              </Text>
            </View>
            {/* Right: Scores */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, textAlign: 'center' }}>{data.score || "-"}</Text>

            </View>
          </View>

          {/* Second Column - Ulceration */}
          <View style={[styles.tableCell, { flex: 1, borderRightWidth: 1, borderRightColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center' }]}>

            <Text style={{ fontSize: 10 }}>{data.ulcer || "-"}- Present</Text>
          </View>

          {/* Third Column - Damage */}
          <View style={[styles.tableCell, { flex: 2.5, flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#D3D3D3' }]}>
            {/* Left: Legend */}
            <View style={{ flex: 1, borderRightWidth: 1, paddingRight: 5, borderRightColor: '#D3D3D3' }}>
              <Text style={{ fontSize: 9, fontWeight: 600 }}>
                0 - absent{"\n"}
                1 - dyspigmentation{"\n"}
                2 - scarring
              </Text>
            </View>
            {/* Right: Score */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, textAlign: 'center' }}>{data.damage || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Papule Row */}
        <View style={[styles.tableRow, { backgroundColor: '#D3D3D3' }]}>
          <View style={[styles.tableCell, { flex: 2.5, borderRightWidth: 1, borderRightColor: '#D3D3D3' }]}>
            <Text style={{ fontSize: 11, fontWeight: 600 }}>
              Papule Present
            </Text>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]} >
            <Text style={{ fontSize: 11 }}>{data.papule || "-"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Form4;