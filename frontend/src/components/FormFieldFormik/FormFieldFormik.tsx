import { ErrorMessage, Field } from "formik";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { FC } from "react";

interface Props {
  label: string;
  name: string;
  is?: FC<any>;
  [key: string]: any;
}

function FormFieldFormik({ label, name, is = MDInput, ...rest }: Props): JSX.Element {
  return (
    <MDBox mb={1.5}>
      <Field {...rest} name={name} as={is} variant="standard" label={label} fullWidth />
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          {(<ErrorMessage name={name} />) as any}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default FormFieldFormik;
