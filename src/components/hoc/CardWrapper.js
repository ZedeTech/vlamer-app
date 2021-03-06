import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import theme from '../../utils/theme';

const CardWrapper = (props) => {
  const { children, ...restProps } = props;
  return (
    <View {...restProps} style={styles.container}>
      {children}
    </View>
  );
};

export default CardWrapper;

const styles = StyleSheet.create({
  container: {
    ...theme.shadows[1],
    margin: theme.spacing(0.4),
    borderRadius: theme.shapes.borderRadios,
    backgroundColor: theme.colors.common,
  },
});
