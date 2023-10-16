import FileUploading, {
  FileUploadingProps,
} from "@/components/shared/FileUploading";
import { supportedUploadFontFormats } from "@/constants";
import React from "react";

const FontUpload: React.FC<any> = (props) => {
  return (
    <FileUploading
      multiple
      acceptType={supportedUploadFontFormats}
      {...props}
    />
  );
};

export default FontUpload;
