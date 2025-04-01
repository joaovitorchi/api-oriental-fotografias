import MDAlert from "components/MDAlert";
import MDBox from "components/MDBox";
export const Details = (): JSX.Element => {
  return (
    <MDBox>
      <MDAlert color="success">
        Agendamento efetuado com sucesso. Aguarde o prestador confirmar o serviço.
      </MDAlert>
    </MDBox>
  );
};
