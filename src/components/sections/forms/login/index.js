import React from "react";
import { Formik } from "formik";
import { Button, Subheading } from "react-native-paper";
import { PrimaryButton } from "../../../common/buttons";
import { InputText } from "../../../common/inputs";
import * as formikHelpers from "./__formik-helper";
import { StyleSheet, View, Text } from "react-native";
import theme from "../../../../utils/theme";

export const LogInForm = ({ navigation }) => {
  return (
    <Formik
      initialValues={formikHelpers.initialValues}
      onSubmit={(values, actions) => navigation.navigate("Home")}
      validationSchema={formikHelpers.validationSchema}
    >
      {({ handleChange, values, handleSubmit, errors }) => (
        <View>
          {errors[formikHelpers.fieldNames.email] && (
            <Text style={styles.errorText}>
              {errors[formikHelpers.fieldNames.email]}
            </Text>
          )}
          <InputText
            style={styles.item}
            placeholder='username or email'
            onChangeText={handleChange(formikHelpers.fieldNames.email)}
            value={values[formikHelpers.fieldNames.email]}
          />
          {errors[formikHelpers.fieldNames.password] && (
            <Text style={styles.errorText}>
              {errors[formikHelpers.fieldNames.password]}
            </Text>
          )}
          <InputText
            style={styles.item}
            placeholder='password'
            secureTextEntry={true}
            onChangeText={handleChange(formikHelpers.fieldNames.password)}
            value={values[formikHelpers.fieldNames.password]}
          />

          <PrimaryButton
            icon='account'
            style={styles.item}
            onPress={handleSubmit}
          >
            Login
          </PrimaryButton>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    fontSize: theme.spacing(0.8),
    color: theme.colors.error,
    alignSelf: "center",
  },
});
