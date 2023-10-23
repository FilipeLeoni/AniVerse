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

import React, { useState } from "react";

interface UploadCreateEpisodePageProps {
  user: any;
  sourceId: string;
  mediaId: number;
}

export default function UploadCreateEpisodePage({
  mediaId,
  sourceId,
  user,
}: any) {
  const [videoState, setVideoState] = useState(null);
  const [subtitles, setSubtitles] = useState<any>([]);
  const [fonts, setFonts] = useState<File[]>([]);
  const [episodeName, setEpisodeName] = useState("");

  //   const { mutate: createEpisode } = useCreateEpisode({
  //     mediaId,
  //     sourceId,
  //   });

  const onSubmit = () => {
    // createEpisode({
    //   episodeName,
    //   fonts,
    //   subtitles,
    //   video: videoState.video,
    //   hostingId: videoState.hostingId,
    // });
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
              <EpisodeSection onChange={setSubtitles} />
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

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Subtitles</label>
              <p className="text-sm text-gray-300">
                Supports {supportedUploadSubtitleFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              {/* <SubtitleUpload onChange={setSubtitles} /> */}
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Fonts</label>
              <p className="text-sm text-gray-300">
                Fonts specifically for .ass subtitle
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <FontUpload onChange={setFonts} />
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

// export const getServerSideProps = withAdditionalUser({
//   async getServerSideProps(ctx, user) {
//     try {
//       const { data: sourceAddedByUser, error } = await supabaseClient
//         .from<Source>("kaguya_sources")
//         .select("id")
//         .eq("addedUserId", user.id)
//         .single();

//       if (error || !sourceAddedByUser?.id) {
//         throw error;
//       }

//       return {
//         props: {
//           sourceId: sourceAddedByUser.id,
//           mediaId: ctx.query.id,
//         },
//       };
//     } catch (err) {
//       return {
//         redirect: {
//           statusCode: 302,
//           destination: "/login",
//         },
//       };
//     }
//   },
// });

// @ts-ignore
// UploadCreateEpisodePage.getLayout = (children) => (
//   <UploadLayout>{children}</UploadLayout>
// );
