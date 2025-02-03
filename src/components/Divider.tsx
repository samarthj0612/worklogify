import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';

import { DimensionValue } from 'react-native';

interface DividerProps {
  width?: DimensionValue;
  color?: string;
  weight?: number;
  style?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({ 
  width = "100%", 
  color = "rgba(0, 0, 0, 0.2)", 
  weight = 1, 
  style 
}) => {
  return (
    <View 
      style={[
        styles.divider, 
        { borderBottomWidth: weight, borderBottomColor: color, width: width }, 
        style
      ]}
    />
  );
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
    marginVertical: 12
  },
});
