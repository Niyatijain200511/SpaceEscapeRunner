import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Spaceship() {
  return (
    <View style={styles.shipContainer}>
      <View style={styles.nose} />

      <View style={styles.body}>
        <View style={styles.cockpit} />
      </View>

      <View style={styles.wingsRow}>
        <View style={styles.wingLeft} />
        <View style={styles.wingRight} />
      </View>

      <View style={styles.flame} />
    </View>
  );
}

const SHIP_WIDTH = 40;

const styles = StyleSheet.create({
  shipContainer: {
  width: SHIP_WIDTH,
  height: 62,
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'yellow',
},


  nose: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4FD1C5',
  },

  body: {
    width: 20,
    height: 22,
    backgroundColor: '#4FD1C5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4FD1C5',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  cockpit: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B0E1A',
  },

  wingsRow: {
    flexDirection: 'row',
    width: SHIP_WIDTH,
    justifyContent: 'space-between',
    marginTop: -6,
  },

  wingLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderRightColor: '#2FB8AB',
  },

  wingRight: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderLeftColor: '#2FB8AB',
  },

  flame: {
    width: 10,
    height: 14,
    backgroundColor: '#FFA94D',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: 2,
    opacity: 0.9,
  },
});