"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import EpisodeNameUpload from "@/components/features/upload/EpisodeNameUpload";
import EpisodeSection from "@/components/features/upload/EpisodeSection";
import FontUpload from "@/components/features/upload/FontUpload";
import UploadSection from "@/components/features/upload/UploadSection";
import VideoUpload from "@/components/features/upload/VideoUpload";
import useCreateChapter from "@/hooks/useCreateChapter";
import Button from "@/components/shared/Button";
import FileUploading from "@/components/shared/FileUploading";
import Input from "@/components/shared/Input";
import Section from "@/components/shared/Section";
import {
  supportedUploadImageFormats,
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";

import React, { useState } from "react";

interface UploadCreateEpisodePageProps {
  user: any;
  sourceId: string;
  mangaId: number;
}

export default function UploadCreateChapterManga({
  params,
}: {
  params: { id: string };
}) {
  const [videoState, setVideoState] = useState(null);
  const [subtitles, setSubtitles] = useState<any>([]);
  const [fonts, setFonts] = useState<File[]>([]);
  const [episodeName, setEpisodeName] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");

  const mangaId = params.id.toString();
  console.log(mangaId);
  const [images, setImages] = useState<File[]>([]);

  const { mutate: createChapter } = useCreateChapter({
    mangaId,
  });

  const onSubmit = () => {
    createChapter({
      chapterNumber,
      chapterName,
      images,
    });
  };

  return (
    <div className="overflow-y-auto">
      <UploadContainer className="pb-12 pt-10" isVerified={true}>
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Chapter</label>
            </UploadSection.Left>

            <UploadSection.Right className="flex flex-col gap-4">
              <Input
                label={"Number (required)"}
                placeholder="1"
                containerClassName="w-fulltext-gray-300"
                className="px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 rounded-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChapterNumber(e.target.value)
                }
              />
              <Input
                label={"Title (optional)"}
                placeholder="Cute girls doing cute things"
                containerClassName="w-full mb-8 text-gray-300"
                className="px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 rounded-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setChapterName(e.target.value)
                }
              />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Images</label>
              <p className="text-sm text-gray-300">
                Support {supportedUploadImageFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <FileUploading
                multiple
                acceptType={supportedUploadImageFormats}
                // onFileChange={(files: File[]) => setImages(files)}
                onChange={(files: File[]) => setImages(files)}
              />
            </UploadSection.Right>
          </UploadSection>
        </div>
      </UploadContainer>

      <Section className="py-3 flex justify-end gap-2 items-center fixed bottom-0 w-full md:w-4/5 bg-background-800 -ml-3">
        <Button onClick={onSubmit} primary>
          Upload
        </Button>
      </Section>
    </div>
  );
}
