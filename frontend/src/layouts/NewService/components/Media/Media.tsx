import MDBox from "components/MDBox";
import MDDropzone from "components/MDDropzone";
import MDTypography from "components/MDTypography";
import { useMemo, useState } from "react";

export const Media = ({ formData, setFieldValue }: any): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);

  const options = {
    maxFiles: 5,
    acceptedFiles: ".jpg, .jpeg, .png",
    addRemoveLinks: true,
    dictDefaultMessage: "Arraste e solte os arquivos aqui ou clique para selecionar",
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setFieldValue("images", newFiles);
  };

  return (
    <MDBox>
      <MDTypography variant="h5">Imagens</MDTypography>
      <MDBox mt={3}>
        <MDBox>
          <MDTypography component="label" variant="button" fontWeight="regular" color="text">
            Imagens do produto
          </MDTypography>
        </MDBox>
        {useMemo(
          () => (
            <MDDropzone options={options} onFilesChange={handleFilesChange} />
          ),
          []
        )}
      </MDBox>
    </MDBox>
  );
};
