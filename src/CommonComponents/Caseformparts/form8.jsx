import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form8 = ({ data, visit }) => {
  const activityTotal = data?.activity || 0;
  const damageTotal = data?.damage || 0;
  return (
    // <View style={styles.section}>
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap={false}>
      {/* <Text style={styles.sectionTitle}>Summary - {visit === 'initial' ? 'Initial' : 'Follow-up'}</Text> */}

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.subHeader]}>
          <Text style={styles.tableCell} colSpan={2}>
            Overall Score Summary
          </Text>
        </View>

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
            Total Activity Score
          </Text>
        </View>




        {/* <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { backgroundColor: '#da4a6bff' }]}>
            Total Activity Score
          </Text>
          <Text style={[styles.tableCell, { backgroundColor: '#da4a6bff' }]}>
            {activityTotal}
          </Text>
        </View> */}

        <View style={styles.tableRow}>
          <Text style={styles.tableCell} colSpan={2}>
            Add up: Erythema, Scale, Excoriation, Ulceration, Gottron's, Periungual, Alopecia
          </Text>
          <Text style={[styles.tableCell, { backgroundColor: '#c6eaf1ff' }]}>
            {activityTotal}
          </Text>
        </View>

        {/* <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { backgroundColor: '#ffebee' }]}>
            Total Damage Score
          </Text>
        
        </View> */}

        <View style={[styles.tableRow, { backgroundColor: '#e71f1f', color: '#fff' }]}>
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
            Total Damage Score
          </Text>
        </View>




        <View style={styles.tableRow}>
          <Text style={styles.tableCell} colSpan={2}>
            Add up: Poikiloderma, Calcinosis
          </Text>
          <Text style={[styles.tableCell, { backgroundColor: '#ffebee' }]}>
            {damageTotal}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Form8;
