import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form6 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  return (
    <View style={styles.section}>
      {/* Section title */}
      {/* <Text style={styles.sectionTitle}>
        {sectionName} - {visit === 'initial' ? 'Initial' : 'Follow-up'}
      </Text> */}

      <View style={styles.table}>
        {/* Table Header: Alopecia Title */}
        <View style={[styles.tableRow, { backgroundColor: "rgb(11, 87,208)", color: '#fff' }]}>
          <Text
            style={[
              styles.tableCell,
              {
                textAlign: 'center',
                fontSize: 14,
                padding: 8,
              },
            ]}
            colSpan={3}
          >
            Alopecia
          </Text>
        </View>

        {/* Subheading */}
        <View style={[styles.tableRow, { backgroundColor: '#D3D3D3' }]}>
          <Text style={[styles.tableCell, { fontSize: 10 }]} colSpan={2}>
            Recent Hair loss (within last 30 days as reported by the patient)
          </Text>
        </View>

        {/* Main Row */}
        <View style={styles.tableRow}>
          {/* Description */}
          <Text
            style={[
              styles.tableCell,
              {
                flex: 2,
                fontSize: 9,
                fontWeight: 'bold',
                lineHeight: 1.4,
              },
            ]}
          >
            0 - absent{"\n"}
            1 - present
          </Text>

          {/* Score */}
          <Text style={styles.tableCell}>{data.hairLoss || "-"}</Text>
        </View>
      </View>
    </View>
  );
};

export default Form6;
