import FileUploading from "@/components/shared/FileUploading";
import Loading from "@/components/shared/Loading";
import Select from "@/components/shared/Select";
import { supportedUploadVideoFormats } from "@/constants";
// import useHostings from "@/hooks/useHostings";
import React, { useMemo, useRef, useState } from "react";

export type VideoState = {
  video: File | string;
  type: string;
};

export type VideoUploadOnChange = ({ video, type }: VideoState) => void;

export interface VideoUploadProps {
  onChange?: VideoUploadOnChange;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onChange }) => {
  const textAreaRef = useRef<any>(null);

  const [videoType, setVideoType] = useState<any>(null);

  const handleTextAreaBlur = () => {
    console.log(textAreaRef.current.value);
    onChange?.({ video: textAreaRef.current.value, type: videoType });
  };

  const handleSelectChange = ({ value }: { value?: string }) => {
    setVideoType(value);
  };

  const options = [
    {
      value: "file",
      label: "File",
    },
    {
      value: "link",
      label: "Link",
    },
  ];

  return (
    <div className="relative">
      <React.Fragment>
        <div className="flex justify-end">
          <Select
            options={options}
            placeholder="Type"
            onChange={handleSelectChange as any}
            defaultValue={options[0]}
          />
        </div>

        {videoType === "link" ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleTextAreaBlur}
            className="mt-2 p-2 w-full h-36 bg-background-900 text-white border-gray-300 border"
            placeholder={
              "Please insert the video link here. Example video link: https://www.youtube.com/watch?v=example123"
            }
          />
        ) : (
          <div className="mt-2">
            <FileUploading
              acceptType={supportedUploadVideoFormats}
              onChange={(video: any) => onChange?.({ video, type: "file" })}
            />
          </div>
        )}
      </React.Fragment>
    </div>
  );
};

export default VideoUpload;
