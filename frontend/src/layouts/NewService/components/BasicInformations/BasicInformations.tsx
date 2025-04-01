import { Grid, Autocomplete } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormFieldFormik from "components/FormFieldFormik";

export const BasicInformations = ({ formData }: any): JSX.Element => {
  const { formField, values, errors, touched } = formData;
  const { name, providerName, description, categoryId } = formField;
  const {
    name: nameV,
    providerName: providerNameV,
    categoryId: categoryIdV,
    description: descriptionV,
  } = values;
  const optionsCategory = [
    { id: 1, label: "Doméstico" },
    { id: 2, label: "Carros" },
    { id: 3, label: "Saúde" },
    { id: 4, label: "Beleza" },
    { id: 5, label: "Tecnologia" },
    { id: 6, label: "Educação" },
    { id: 7, label: "Alimentação" },
    { id: 8, label: "Transporte" },
    { id: 9, label: "Construção" },
    { id: 10, label: "Limpeza" },
    { id: 11, label: "Jardinagem" },
    { id: 12, label: "Consultoria" },
    { id: 13, label: "Eventos" },
    { id: 14, label: "Pet Care" },
    { id: 15, label: "Móveis e Decoração" },
  ];

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">Informações básicas</MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormFieldFormik
              type={name.type}
              label={name.label}
              name={name.name}
              value={nameV}
              placeholder={name.placeholder}
              error={errors.name && touched.name}
              success={nameV.length > 0 && !errors.name}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormFieldFormik
              type={providerName.type}
              label={providerName.label}
              name={providerName.name}
              value={providerNameV}
              placeholder={providerName.placeholder}
              error={errors.providerName && touched.providerName}
              success={providerNameV > 0 && !errors.providerName}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={optionsCategory}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => {
                formData.values.categoryId = value.id;
              }}
              renderInput={(params) => {
                return (
                  <FormFieldFormik
                    {...params}
                    label={categoryId.label}
                    name={categoryId.name}
                    value={categoryIdV}
                    placeholder={categoryId.placeholder}
                    error={errors.categoryId && touched.categoryId}
                    success={categoryIdV > 0 && !errors.categoryId}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormFieldFormik
              type={description.type}
              label={description.label}
              name={description.name}
              value={descriptionV}
              placeholder={description.placeholder}
              error={errors.description && touched.description}
              success={descriptionV.length > 0 && !errors.description}
              helperText={`${descriptionV.length}/500`}
              multiline
              rows={5}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
};
