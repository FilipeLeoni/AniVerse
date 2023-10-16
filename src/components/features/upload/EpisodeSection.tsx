import FileUploading from "@/components/shared/FileUploading";
import Input, { InputProps } from "@/components/shared/Input";
import { supportedUploadImageFormats } from "@/constants";
import React, { useState } from "react";

interface EpisodeNameUploadProps {
  onChange: (episodeName: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const EpisodeSection: React.FC<EpisodeNameUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [episodeName, setEpisodeName] = useState("");

  return (
    <div>
      <div className="flex gap-10 mb-4">
        <div className=" h-full">
          <label>Thumbnail (optional)</label>
          <FileUploading multiple acceptType={supportedUploadImageFormats} />
        </div>

        <div className="flex-1">
          <Input
            label="Number (required)"
            placeholder="1"
            className="px-3 py-2"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;

              setEpisodeName(target.value);
            }}
            onBlur={() => {
              onChange?.(episodeName);
            }}
            {...inputProps}
          />
          <Input
            label="Title (optional)"
            placeholder="You are awesome!"
            className="px-3 py-2"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;

              setEpisodeName(target.value);
            }}
            onBlur={() => {
              onChange?.(episodeName);
            }}
            {...inputProps}
          />
        </div>
      </div>
      <Input
        label="Description (optional)"
        placeholder="Because you are awesome, so you are uploading a new episode!"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setEpisodeName(target.value);
        }}
        onBlur={() => {
          onChange?.(episodeName);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeSection;
