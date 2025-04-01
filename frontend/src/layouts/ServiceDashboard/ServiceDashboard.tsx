import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import servicesService from "services/services-service";
import ServiceImages from "./components/ServiceImages";
import ServiceInfo from "./components/ServiceInfo";
import { ServiceFile } from "models/service-file.model";
import { Service } from "models/Service.model";

export const ServiceDashboard = (): JSX.Element => {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [otherServicesList, setOtherServicesList] = useState<Service[] | null>([]);
  const [images, setImages] = useState<ServiceFile[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado de sucesso

  useEffect(() => {
    const getServiceById = async () => {
      try {
        const { service } = await servicesService.getById(Number(serviceId));
        setService(service);
        setImages(service.images);
      } catch (error) {
        setError("Erro ao carregar os detalhes do serviço. Por favor, tente novamente.");
        setService(null);
        setImages(null);
      }
    };

    const listOtherServices = async () => {
      try {
        const { services } = await servicesService.list(null, null, null, 1, false);
        setOtherServicesList(services);
      } catch (error) {
        setError("Erro ao carregar outros serviços do mesmo prestador.");
        setOtherServicesList(null);
      }
    };

    getServiceById();
    listOtherServices();
  }, [serviceId]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  if (!service) {
    return (
      <DashboardLayout>
        <DashboardNavbar titleToBradcrumb="Serviços" title="Meus Serviços" />
        <MDBox py={3}>
          {error && (
            <MDBox mb={3}>
              <MDAlert color="error">{error}</MDAlert>
            </MDBox>
          )}
          <MDTypography>Carregando informações...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar titleToBradcrumb="Serviços" title="Meus Serviços" />
      <MDBox py={3}>
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
        <Card sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <MDBox mb={3}>
              <MDTypography variant="h5" fontWeight="medium">
                Detalhes do serviço
              </MDTypography>
            </MDBox>

            <Grid container spacing={3}>
              {service.serviceId && (
                <Grid item xs={12} lg={6} xl={5}>
                  <ServiceImages images={images} />
                </Grid>
              )}
              <Grid item xs={12} lg={5} sx={{ mx: "auto" }}>
                <ServiceInfo service={service} />
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};
