import { Grid } from "@mui/material";
import FormFieldFormik from "components/FormFieldFormik";
import MDBox from "components/MDBox";
import MDDatePicker from "components/MDDatePicker";
import MDTypography from "components/MDTypography";

export const BasicInformations = ({ formData }: any): JSX.Element => {
  const { formField, values, errors, touched } = formData;
  const { appointmentDate, obs } = formField;
  let { appointmentDateV, obsV } = values;

  const setSelectedDate = (appointmentDate: string) => {
    appointmentDateV = appointmentDate;
    console.log(appointmentDateV);
  };

  const formatDateForForm = (dateString: string) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day} ${timePart}`;
  };

  return (
    <MDBox>
      <Grid container>
        <Grid item mb={5} xs={12}>
          <MDTypography fontSize="small" fontWeight="regular" color="text">
            Selecione uma data para o agendamento
          </MDTypography>
          <MDDatePicker
            value={appointmentDateV}
            onChange={(event: any, value: any) => {
              const formattedDate = formatDateForForm(value);
              formData.values.appointmentDate = formattedDate;
            }}
            options={{
              dateFormat: "d/m/Y H:i",
              enableTime: true,
              time_24hr: true,
            }}
            input={{ placeholder: "Selecione" }}
            renderInput={(params: any) => {
              return (
                <FormFieldFormik
                  {...params}
                  label={appointmentDate.label}
                  name={appointmentDate.name}
                  value={appointmentDateV}
                  placeholder={appointmentDate.placeholder}
                  error={errors.appointmentDate && touched.appointmentDate}
                  success={appointmentDateV > 0 && !errors.appointmentDate}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormFieldFormik
            type={obs.type}
            label={obs.label}
            name={obs.name}
            value={obsV}
            placeholder={obs.placeholder}
            error={errors.obs && touched.obs}
            success={obsV > 0 && !errors.obs}
          />
        </Grid>
      </Grid>
    </MDBox>
  );
};
