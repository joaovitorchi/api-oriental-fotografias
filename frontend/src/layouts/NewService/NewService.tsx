import { Card, Grid, Step, StepLabel, Stepper } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState, useEffect } from "react";
import BasicInformations from "./components/BasicInformations";
import Location from "./components/Location";
import Details from "./components/Details";
import Media from "./components/Media";
import servicesService from "services/services-service";
import { Service } from "models/Service.model";
import serviceForm from "./schemas/serviceForm";
import validations from "./schemas/serviceValidations";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import initialValuesServiceForm from "./schemas/initialValues";
import MDButton from "components/MDButton";
import servicesFileService from "services/services-file-service";

function getSteps(): string[] {
  return ["Informações básicas", "Detalhes", "Localização", "Imagens"];
}

function getStepContent(stepIndex: number, formData: any, setFieldValue: any): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <BasicInformations formData={formData} />;
    case 1:
      return <Details formData={formData} />;
    case 2:
      return <Location formData={formData} />;
    case 3:
      return <Media formData={formData} setFieldValue={setFieldValue} />;
    default:
      return null;
  }
}

export const NewService = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado de sucesso
  const steps = getSteps();
  const { formId, formField } = serviceForm;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const handleBack = (data: any) => setActiveStep(activeStep - 1);

  const submitForm = async (values: Service, actions: FormikHelpers<Service>) => {
    try {
      const images = values.images ? values.images : [];

      if (images && images.length > 0) {
        if (images.length > 5) {
          setError("É permitido no máximo 5 imagens por vez.");
          actions.setSubmitting(false);
          return;
        }
        values.images = null;
      }

      const formData = new FormData();
      images.forEach((file: any, index) => {
        formData.append("files", file);
      });

      const { service } = await servicesService.create(values);

      if (service && service.hasOwnProperty("serviceId") && formData) {
        await servicesFileService.uploadImages(formData, service.serviceId);
      }

      setSuccessMessage("Serviço cadastrado com sucesso!"); // Mensagem de sucesso
      actions.setSubmitting(false);
      actions.resetForm();
      setActiveStep(0);
    } catch (error) {
      setError("Erro ao cadastrar serviço. Por favor, tente novamente.");
      actions.setSubmitting(false);
    }
  };

  const handleSubmit = (values: Service, actions: FormikHelpers<Service>) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <DashboardLayout>
      <DashboardNavbar titleToBradcrumb="Serviço" title="Novo Serviço" />
      <MDBox mb={9}>
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Grid item xs={12} lg={8}>
            {successMessage && (
              <MDBox mb={3}>
                <MDAlert color="success" dismissible onClose={() => setSuccessMessage(null)}>
                  {successMessage}
                </MDAlert>
              </MDBox>
            )}
            {error && (
              <MDBox mb={3}>
                <MDAlert color="error">{error}</MDAlert>
              </MDBox>
            )}
            <Formik
              initialValues={initialValuesServiceForm}
              validationSchema={currentValidation}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }: FormikProps<Service>) => (
                <Form id={formId} autoComplete="off">
                  <MDBox mt={6} mb={8} textAlign="center">
                    <MDBox mb={1}>
                      <MDTypography variant="h3" fontWeight="bold">
                        Cadastrar Novo Serviço
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="h5" fontWeight="regular" color="secondary">
                      Estas informações descreverão mais sobre o serviço prestado.
                    </MDTypography>
                  </MDBox>
                  <Card sx={{ height: "100%" }}>
                    <MDBox mx={2} mt={-3}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </MDBox>
                    <MDBox p={3}>
                      <MDBox>
                        {getStepContent(
                          activeStep,
                          { values, touched, formField, errors },
                          setFieldValue
                        )}
                        <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                          {activeStep === 0 ? (
                            <MDBox />
                          ) : (
                            <MDButton variant="gradient" color="light" onClick={handleBack}>
                              voltar
                            </MDButton>
                          )}
                          <MDButton
                            disabled={isSubmitting}
                            type="submit"
                            variant="gradient"
                            color="dark"
                          >
                            {isLastStep ? "enviar" : "próximo"}
                          </MDButton>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};
