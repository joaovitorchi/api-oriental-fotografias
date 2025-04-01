import { Autocomplete, Grid, InputAdornment } from "@mui/material";
import typography from "assets/theme/base/typography";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormFieldFormik from "components/FormFieldFormik";

export const Details = ({ formData }: any): JSX.Element => {
  const { size } = typography;
  const { formField, values, errors, touched } = formData;
  const { price, unitId, paymentMethodIds } = formField;
  const { price: priceV, unitId: unitIdV, paymentMethodIds: paymentMethodIdsV } = values;
  const optionsUnit = [
    { label: "Minuto", id: 1 },
    { label: "Hora", id: 2 },
    { label: "Dia", id: 3 },
    { label: "Mês", id: 4 },
    { label: "Ano", id: 5 },
  ];
  const optionsPayment = [
    { label: "Dinheiro", id: 1 },
    { label: "Débito", id: 2 },
    { label: "Crédito", id: 3 },
    { label: "Pix", id: 4 },
  ];

  return (
    <MDBox p={2}>
      <MDBox>
        <MDBox>
          <MDBox mt={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <FormFieldFormik
                  type={price.type}
                  label={price.label}
                  name={price.name}
                  value={priceV}
                  placeholder={price.placeholder}
                  error={errors.price && touched.price}
                  success={priceV > 0 && !errors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MDTypography fontSize="small">R$</MDTypography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1} display={"flex"} alignItems={"center"}>
                <MDTypography fontSize={size.sm}>por</MDTypography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  options={optionsUnit}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, value) => {
                    formData.values.unitId = value.id;
                  }}
                  renderInput={(params) => {
                    return (
                      <FormFieldFormik
                        {...params}
                        label={unitId.label}
                        name={unitId.name}
                        value={unitIdV}
                        placeholder={unitId.placeholder}
                        error={errors.unitId && touched.unitId}
                        success={unitIdV > 0 && !errors.unitId}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={optionsPayment}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(event, value) => {
                    formData.values.paymentMethodIds = value.map((el) => el.id);
                  }}
                  multiple
                  disableClearable
                  size="small"
                  renderInput={(params) => {
                    return (
                      <FormFieldFormik
                        {...params}
                        variant="standard"
                        fullWidth
                        label={paymentMethodIds.label}
                        name={paymentMethodIds.name}
                        value={paymentMethodIdsV}
                        placeholder={paymentMethodIds.placeholder}
                        error={errors.paymentMethodIds && touched.paymentMethodIds}
                        success={paymentMethodIdsV > 0 && !errors.paymentMethodIds}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};
