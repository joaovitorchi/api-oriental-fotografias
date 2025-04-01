import { Card, Grid, InputAdornment } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormFieldFormik from "components/FormFieldFormik";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useState } from "react";
import { Service } from "models/Service.model";
import serviceForm from "layouts/NewService/schemas/serviceForm";
import validations from "layouts/NewService/schemas/serviceValidations";
import servicesService from "services/services-service";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

interface Props {
  service: Service;
  onUpdate: () => void;
}

export const ServiceInfo = ({ service, onUpdate }: Props): JSX.Element => {
  const { formId, formField } = serviceForm;
  const currentValidation = validations[0];
  const { name, price, description, categoryId } = formField;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado de sucesso

  const handleSubmit = (values: Service, actions: FormikHelpers<Service>) => {
    submitForm(values, actions);
  };

  const submitForm = async (values: Service, actions: FormikHelpers<Service>) => {
    try {
      await servicesService.update(values);
      actions.setSubmitting(false);
      setErrorMessage(null);
      setSuccessMessage("Alterações salvas com sucesso!"); // Mensagem de sucesso
      onUpdate();
    } catch (error) {
      actions.setSubmitting(false);
      setErrorMessage("Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  return (
    <Card>
      <Formik initialValues={service} validationSchema={currentValidation} onSubmit={handleSubmit}>
        {({ values, errors, touched, isSubmitting, setFieldValue }: FormikProps<Service>) => (
          <Form id={formId} autoComplete="off">
            <MDBox p={3}>
              <MDTypography variant="h5">Informações do Serviço</MDTypography>
              {successMessage && (
                <MDBox mt={2}>
                  <MDAlert color="success" dismissible onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                  </MDAlert>
                </MDBox>
              )}
              {errorMessage && (
                <MDBox mt={2}>
                  <MDAlert color="error" dismissible onClose={() => setErrorMessage(null)}>
                    {errorMessage}
                  </MDAlert>
                </MDBox>
              )}
              <MDBox mt={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormFieldFormik
                      type={name.type}
                      label={name.label}
                      name={name.name}
                      value={values.name}
                      placeholder={name.placeholder}
                      error={errors.name && touched.name}
                      success={values.name.length > 0 && !errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} display="flex" alignItems="end">
                    <FormFieldFormik
                      type={price.type}
                      label={price.label}
                      name={price.name}
                      value={values.price}
                      placeholder={price.placeholder}
                      error={errors.price && touched.price}
                      success={Number(values.price) > 0 && !errors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MDTypography fontSize="small">R$</MDTypography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormFieldFormik
                      type={description.type}
                      label={description.label}
                      name={description.name}
                      value={values.description}
                      placeholder={description.placeholder}
                      error={errors.description && touched.description}
                      success={values.description.length > 0 && !errors.description}
                      helperText={`${values.description.length}/500`}
                      multiline
                      rows={5}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MDBox display="flex" justifyContent="flex-end">
                      <MDButton
                        variant="gradient"
                        color="dark"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        salvar
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </Form>
        )}
      </Formik>
    </Card>
  );
};
