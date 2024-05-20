import FileUploading from "@/components/shared/FileUploading";
import Input, { InputProps } from "@/components/shared/Input";
import { supportedUploadImageFormats } from "@/constants";
import React, { useEffect, useState } from "react";

interface EpisodeNameUploadProps {
  onChange: (episodeData: any) => void;
  inputProps?: Omit<InputProps, "ref">;
  defaultData?: any;
}

const EpisodeSection: React.FC<EpisodeNameUploadProps> = ({
  onChange,
  inputProps,
  defaultData,
}) => {
  const [episodeData, setEpisodeData] = useState({
    episodeName: defaultData?.episodeName || "",
    episodeNumber: defaultData?.episodeNumber || "",
    episodeDescription: defaultData?.episodeDescription || "",
    // thumbnail: "",
  });

  useEffect(() => {
    if (defaultData) {
      setEpisodeData({
        episodeName: defaultData?.episodeName || "",
        episodeNumber: defaultData?.episodeNumber || "",
        episodeDescription: defaultData?.episodeDescription || "",
        // thumbnail: "",
      });
    }
  }, [defaultData]);

  console.log(defaultData);
  console.log(episodeData.episodeName);
  const handleInputChange = (field: string, value: any) => {
    console.log(value);
    setEpisodeData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleBlur = () => {
    if (onChange) {
      onChange(episodeData);
    }
  };
  return (
    <div>
      <div className="flex gap-10 mb-4">
        <div className=" h-full">
          <label>Thumbnail (optional)</label>
          <FileUploading
            acceptType={supportedUploadImageFormats}
            onChange={(image: any) =>
              onChange({ ...episodeData, thumbnail: image })
            }
          />
        </div>

        <div className="flex-1">
          <Input
            label="Number (required)"
            placeholder="1"
            className="px-3 py-2"
            value={episodeData.episodeNumber}
            onChange={(e: any) =>
              handleInputChange("episodeNumber", e.target.value)
            }
            onBlur={handleBlur}
            // onChange={(e) => {
            //   const target = e.target as HTMLInputElement;

            //   setEpisodeNumber(target.value);
            // }}

            // onBlur={() => {
            //   onChange?.(episodeNumber);
            // }}
            {...inputProps}
          />
          <Input
            label="Title (optional)"
            placeholder="You are awesome!"
            value={episodeData.episodeName}
            className="px-3 py-2"
            onChange={(e: any) =>
              handleInputChange("episodeName", e.target.value)
            }
            onBlur={handleBlur}
            // onChange={(e) => {
            //   const target = e.target as HTMLInputElement;

            //   setEpisodeName(target.value);
            // }}
            // onBlur={() => {
            //   onChange?.(episodeName);
            // }}
            {...inputProps}
          />
        </div>
      </div>
      <Input
        label="Description (optional)"
        value={episodeData.episodeDescription}
        placeholder="Because you are awesome, so you are uploading a new episode!"
        className="px-3 py-2"
        onChange={(e: any) =>
          handleInputChange("episodeDescription", e.target.value)
        }
        onBlur={handleBlur}
        // onChange={(e) => {
        //   const target = e.target as HTMLInputElement;

        //   setEpisodeDescription(target.value);
        // }}
        // onBlur={() => {
        //   onChange?.({ description: episodeDescription });
        // }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeSection;
