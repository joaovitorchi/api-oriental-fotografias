import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/illustration-reset.jpg";
import authService from "services/auth-service";
import { AuthContext } from "context";

function Illustration(): JSX.Element {
  const authContext = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [user, setUser] = useState({});
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [credentialsErros, setCredentialsError] = useState(null);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });
  const addUserHandler = (newUser: any) => setUser(newUser);

  const changeHandler = (e: any) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: any) => {
    // check rememeber me?
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = { email: inputs.email, password: inputs.password };
    addUserHandler(newUser);

    try {
      const response = await authService.login(newUser);
      authContext.login(response.token);
    } catch (res: any) {
      setCredentialsError(res.errors.map((e: { msg: string }) => e.msg).join(", "));
    }

    return () => {
      setInputs({
        email: "",
        password: "",
      });

      setErrors({
        emailError: false,
        passwordError: false,
      });
    };
  };

  return (
    <IllustrationLayout
      title="Entrar"
      description="Digite seu e-mail e senha para fazer login"
      illustration={bgImage}
    >
      <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="E-mail"
            fullWidth
            value={inputs.email}
            name="email"
            onChange={changeHandler}
            error={errors.emailError}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="password"
            label="Senha"
            fullWidth
            name="password"
            value={inputs.password}
            onChange={changeHandler}
            error={errors.passwordError}
          />
        </MDBox>
        <MDBox display="flex" alignItems="center" ml={-1}>
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;&nbsp;Mantenha-me conectado
          </MDTypography>
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton variant="gradient" color="info" size="large" fullWidth type="submit">
            Entrar
          </MDButton>
        </MDBox>
        {credentialsErros && (
          <MDTypography variant="caption" color="error" fontWeight="light">
            {credentialsErros}
          </MDTypography>
        )}
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Não possui uma conta?{" "}
            <MDTypography
              component={Link}
              to="/auth/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Cadastrar-se
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </IllustrationLayout>
  );
}

export default Illustration;
