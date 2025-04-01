import { useEffect, useRef, useState } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import MDBox from "components/MDBox";
import MDDropzoneRoot from "components/MDDropzone/MDDropzoneRoot";
import { useMaterialUIController } from "context";

interface Props {
  options: {
    [key: string | number]: any;
  };
  onFilesChange: (files: File[]) => void;
}

function MDDropzone({ options, onFilesChange }: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    Dropzone.autoDiscover = false;

    function createDropzone() {
      const optionsDrop = {
        ...options,
        autoProcessQueue: false,
        url: "/",
        dictRemoveFile: "Remover arquivo",
      };

      return new Dropzone(dropzoneRef.current as HTMLDivElement, {
        ...optionsDrop,
        init() {
          this.on("addedfile", (file: File) => {
            setFiles((prevFiles) => [...prevFiles, file]);
          });
          this.on("removedfile", (file: File) => {
            setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
          });
        },
      });
    }

    function removeDropzone() {
      if (Dropzone.instances.length > 0) Dropzone.instances.forEach((dz: any) => dz.destroy());
    }

    createDropzone();

    return () => removeDropzone();
  }, [options]);

  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  return (
    <MDDropzoneRoot ref={dropzoneRef} className="form-control dropzone" ownerState={{ darkMode }}>
      <MDBox className="fallback" bgColor="transparent">
        <input name="file" type="file" multiple />
      </MDBox>
    </MDDropzoneRoot>
  );
}

export default MDDropzone;
