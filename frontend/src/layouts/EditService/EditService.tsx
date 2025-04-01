import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import servicesService from "services/services-service";
import ServiceImage from "./components/ServiceImage";
import Footer from "examples/Footer";
import ServiceInfo from "./components/ServiceInfo";

export const EditService = (): JSX.Element => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado de sucesso

  useEffect(() => {
    const getServiceById = async () => {
      try {
        const { service } = await servicesService.getById(Number(serviceId));
        setService(service);
        setErrorMessage(null);
        setSuccessMessage("Informações do serviço carregadas com sucesso!"); // Mensagem de sucesso
      } catch (error) {
        setService(null);
        setErrorMessage("Ocorreu um erro ao carregar as informações do serviço. Tente novamente.");
      }
    };

    getServiceById();
  }, [serviceId]);

  const handleUpdate = () => {
    console.log("Atualizei");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar titleToBradcrumb="Serviços" title="Editar Serviço" />
      {successMessage && (
        <MDBox my={3}>
          <MDAlert color="success" dismissible onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </MDAlert>
        </MDBox>
      )}
      {errorMessage && (
        <MDBox my={3}>
          <MDAlert color="error" dismissible onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </MDAlert>
        </MDBox>
      )}
      {service && (
        <MDBox my={3}>
          <MDBox mb={6}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={6}>
                <MDTypography variant="h4" fontWeight="medium">
                  Faça as alterações abaixo
                </MDTypography>
                <MDBox mt={1} mb={2}>
                  <MDTypography variant="body2" color="text">
                    Insira as informações atualizadas do serviço.
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <ServiceImage service={service} />
            </Grid>
            <Grid item xs={12} lg={8}>
              <ServiceInfo service={service} onUpdate={handleUpdate} />
            </Grid>
          </Grid>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
};
