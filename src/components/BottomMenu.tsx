import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BottomMenuProps {
  active: 'Map' | 'Search';
  onPressMap: () => void;
  onPressSearch: () => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ active, onPressMap, onPressSearch }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, active === 'Map' && styles.activeButton]} onPress={onPressMap}>
        <Text style={styles.buttonText}>MAP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, active === 'Search' && styles.activeButton]} onPress={onPressSearch}>
        <Text style={styles.buttonText}>SEARCH</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingInline: 5,
    alignItems: 'center',
    zIndex: 999,
  },
  button: {
    paddingVertical: 20,
    width: '50%',
    backgroundColor: '#63aeee',
    borderRadius: 50,
    display: "flex",
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2699fb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BottomMenu;
