import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { Autocomplete } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import authService from "services/auth-service";
import { useContext, useState } from "react";
import { AuthContext } from "context";

function Cover(): JSX.Element {
  interface FormData {
    name: string;
    email: string;
    password: string;
    acceptTerms: boolean;
  }

  const authContext = useContext(AuthContext);
  const [credentialsErros, setCredentialsError] = useState(null);
  const validationSchema: yup.ObjectSchema<FormData> = yup
    .object({
      name: yup.string().required("Campo obrigatório"),
      email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
      password: yup.string().required("Campo obrigatório"),
      acceptTerms: yup.bool().oneOf([true], "Aceite os termos para continuar"),
    })
    .required();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
  });
  const onSubmit = async (data: FormData) => {
    try {
      const response = await authService.register(data);
      authContext.login(response.token);
    } catch (res: any) {
      setCredentialsError(res.errors.map((e: { msg: string }) => e.msg).join(", "));
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Junte-se a nós hoje
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Digite seu e-mail e senha para se registrar
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                {...register("name")}
                error={errors.name}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="E-mail"
                variant="standard"
                fullWidth
                {...register("email")}
                error={errors.email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Senha"
                variant="standard"
                fullWidth
                {...register("password")}
                error={errors.password}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox {...register("acceptTerms")} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Eu aceito os&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Termos e condições
              </MDTypography>
            </MDBox>
            {errors.acceptTerms && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.acceptTerms.message}
              </MDTypography>
            )}
            {credentialsErros && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsErros}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Inscrever-se
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Já possui uma conta?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Entrar
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
