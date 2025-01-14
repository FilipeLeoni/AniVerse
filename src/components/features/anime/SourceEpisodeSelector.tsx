import Select from "@/components/shared/Select";
import { groupBy, sortObjectByValue } from "@/utils";
import React, { useLayoutEffect, useMemo, useState } from "react";
import EpisodeSelector from "./EpisodeSelector";

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const SourceEpisodeSelector: React.FC<any> = ({
  episodes,
  activeEpisode,
  ...episodeSelectorProps
}) => {
  const [videoContainer, setVideoContainer] = useState<HTMLElement>();

  const verifiedSources = useMemo(() => {
    const verifiedEpisodes = episodes.filter(
      (episode: any) => episode.source.isCustomSource
    );

    const sources = groupBy(
      verifiedEpisodes,
      (episode: any) => episode.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a: any, b: any) => b.length - a.length
    );

    return sortedSources;
  }, [episodes]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedEpisodes = episodes.filter(
      (episode: any) => !episode.source.isCustomSource
    );

    const sources = groupBy(
      nonVerifiedEpisodes,
      (episode: any) => episode.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a: any, b: any) => b.length - a.length
    );

    return sortedSources;
  }, [episodes]);

  const sources = useMemo(() => {
    return { ...verifiedSources, ...nonVerifiedSources };
  }, [nonVerifiedSources, verifiedSources]);

  const defaultActiveSource = useMemo(
    () =>
      Object.keys(sources).find((source) =>
        sources[source].some(
          (episode: any) =>
            episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
        )
      ),
    [sources, activeEpisode?.sourceEpisodeId]
  );

  const [activeSource, setActiveSource] = useState(
    defaultActiveSource || Object.keys(sources)[0]
  );

  const sourceEpisodes = useMemo(
    () => sources[activeSource],
    [sources, activeSource]
  );

  useLayoutEffect(() => {
    const videoElement: any = document.querySelector(".netplayer-container");

    if (!videoElement) {
      setVideoContainer(document.body);

      return;
    }

    setVideoContainer(videoElement);
  }, []);

  return (
    <React.Fragment>
      <div className="flex justify-end w-full mx-auto mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="source-selector" className="font-medium">
            Sources:{" "}
          </label>

          <Select
            id="source-selector"
            options={[
              {
                label: "Verified",
                options: sourcesToOptions(Object.keys(verifiedSources)),
              },
              {
                label: "Not verified",
                options: sourcesToOptions(Object.keys(nonVerifiedSources)),
              },
            ]}
            onChange={({ value }: any) => {
              setActiveSource(value);
            }}
            defaultValue={{ value: activeSource, label: activeSource }}
            isClearable={false}
            isSearchable={false}
            menuPortalTarget={videoContainer}
          />
        </div>
      </div>

      <EpisodeSelector
        episodes={sourceEpisodes}
        activeEpisode={activeEpisode}
        {...episodeSelectorProps}
      />
    </React.Fragment>
  );
};

export default React.memo(SourceEpisodeSelector);
