"use client";

import UploadContainer from "@/components/features/panel/UploadContainer";
import EpisodeNameUpload from "@/components/features/upload/EpisodeNameUpload";
import EpisodeSection from "@/components/features/upload/EpisodeSection";
import FontUpload from "@/components/features/upload/FontUpload";
import UploadSection from "@/components/features/upload/UploadSection";
import VideoUpload from "@/components/features/upload/VideoUpload";

import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import {
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import { useApi } from "@/hooks/useApi";
import useCreateEpisode from "@/hooks/useCreateEpisode";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UploadCreateEpisodePageProps {
  user: any;
  sourceId: string;
  mediaId: number;
}

export default function EditEpisodePage({ params }: { params: any }) {
  console.log(params);
  const [videoState, setVideoState] = useState<any>(null);
  const [episodeData, setEpisodeData] = useState({
    episodeName: "",
    episodeNumber: "",
    episodeDescription: "",
    thumbnail: "",
  });

  const { id: animeId, episodeId } = params;
  // const episodeId = params.episodeId;
  // const animeId = params.id;
  const { mutate: createEpisode } = useCreateEpisode();
  const api = useApi();
  const { data } = useQuery({
    queryKey: ["getEpisodeById"],
    queryFn: async () => {
      const response = await api.getEpisodeById(episodeId);
      return response;
    },
  });

  useEffect(() => {
    if (data) {
      setEpisodeData({
        episodeName: data.title,
        episodeNumber: data.number,
        episodeDescription: data.description,
        thumbnail: data.thumbnail,
      });
    }
  }, [data]);

  console.log(data);

  const onSubmit = async () => {
    createEpisode({
      animeId: animeId,
      title: episodeData?.episodeName,
      number: episodeData?.episodeNumber,
      description: episodeData?.episodeDescription,
      thumbnail: episodeData?.thumbnail,
      video: videoState?.video,
      type: videoState?.type,
    });
  };

  return (
    <div className="overflow-y-auto">
      <UploadContainer className="pb-12 pt-10" isVerified={true}>
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Episode</label>
            </UploadSection.Left>

            <UploadSection.Right>
              <EpisodeSection
                onChange={setEpisodeData}
                defaultData={episodeData}
              />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Video</label>
              <p className="text-sm text-gray-300">
                Supports {supportedUploadVideoFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <VideoUpload onChange={setVideoState as any} />
            </UploadSection.Right>
          </UploadSection>
        </div>
      </UploadContainer>

      <Section className="py-3 flex justify-end gap-2 items-center fixed bottom-0 w-full md:w-5/6 bg-background-800 -ml-3">
        <Button onClick={onSubmit} primary>
          Upload
        </Button>
      </Section>
    </div>
  );
}
