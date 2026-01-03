
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form5 = ({ data, visit, sectionName }) => {
  if (!data) return null;

  return (
    // <View style={styles.section} >
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap={false}>
      {/* Section title */}

      <View style={styles.table}>
        {/* Main Heading Row */}
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
            colSpan={2}
          >
            Periungual
          </Text>
        </View>

        {/* Subheading Row */}
        <View style={[styles.tableRow, { backgroundColor: '#D3D3D3' }]}>
          <Text style={[styles.tableCell, { fontSize: 10 }]} colSpan={2}>
            Periungual changes (examine)
          </Text>
        </View>

        {/* Scoring Row */}
        <View style={styles.tableRow}>
          {/* Description Cell */}
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
            0 - absent{"\n"}
            1 - pink/red erythema / microscopic telangiectasias{"\n"}
            2 - visible telangiectasias
          </Text>

          {/* Score Value Cell */}
          <Text style={styles.tableCell}>{data.peri || "-"}</Text>
        </View>
      </View>
    </View>
  );
};

export default Form5;
