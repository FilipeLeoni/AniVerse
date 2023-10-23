import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import useUpdateFonts from "@/hooks/useUpdateFonts";
// import { Attachment } from "@/services/upload";
// import { createAttachmentUrl, createFileFromUrl } from "@/utils";
import React, { useState } from "react";
import FontUpload from "./FontUpload";

const FontUpdate: React.FC<any> = ({ initialFonts, episodeSlug }) => {
  const [files, setFiles] = useState<File[]>([]);

  const initialFiles: any = [];

  // const { data: initialFiles, isLoading: initialFilesLoading } = useQuery<
  //   File[]
  // >(["uploaded-font-files", initialFonts], async () => {
  //   if (!initialFonts?.length) return [];

  //   return Promise.all<File>(
  //     initialFonts.map((file) =>
  //       createFileFromUrl(createAttachmentUrl(file.url), file.filename)
  //     )
  //   );
  // });

  const { mutate: updateFonts, isLoading: updateLoading } =
    useUpdateFonts(episodeSlug);

  const handleUpdateClick = () => {
    updateFonts(files);
  };

  return initialFiles ? (
    <Loading />
  ) : (
    <div className="space-y-2">
      <FontUpload onChange={setFiles} initialFiles={initialFiles} />

      <Button
        isLoading={false}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default FontUpdate;
