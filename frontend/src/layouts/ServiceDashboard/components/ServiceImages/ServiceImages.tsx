import { Stack } from "@mui/material";
import MDBox from "components/MDBox";
import { ServiceFile } from "models/service-file.model";
import { useState } from "react";
import ImgsViewer from "react-images-viewer";

interface Props {
  images: ServiceFile[];
}

const imgDefaultBaseUrl = process.env.REACT_APP_IMG_BASE_URL_DEFAULT_PRODUCT_IMG;

export const ServiceImages = ({ images }: Props): JSX.Element => {
  const imgs =
    images && images.length > 0 && images[0].externalId
      ? images.map((img) => {
          return { src: img.externalId };
        })
      : [{ src: imgDefaultBaseUrl }];
  const [currentImage, setCurrentImage] = useState<string>(imgs[0].src);
  const [imgsViewer, setImgsViewer] = useState<boolean | number>(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState<number>(0);

  const handleSetCurrentImage = ({ currentTarget }: any) => {
    setCurrentImage(currentTarget.src);
    setImgsViewerCurrent(Number(currentTarget.id));
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);
  return (
    <MDBox>
      <ImgsViewer
        imgs={imgs}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />

      <MDBox
        component="img"
        src={currentImage}
        alt="Imagem do Serviço"
        shadow="lg"
        borderRadius="lg"
        width="100%"
        onClick={openImgsViewer}
      />
      <MDBox mt={2} pt={1}>
        {imgs.length > 1 && (
          <Stack direction="row" spacing={3}>
            {imgs.map((img) => {
              return (
                <MDBox
                  key={img.src}
                  component="img"
                  id="0"
                  src={img.src}
                  borderRadius="lg"
                  shadow="md"
                  width="100%"
                  height="5rem"
                  minHeight="5rem"
                  sx={{ cursor: "pointer", objectFit: "cover" }}
                  onClick={handleSetCurrentImage}
                />
              );
            })}
          </Stack>
        )}
      </MDBox>
    </MDBox>
  );
};
