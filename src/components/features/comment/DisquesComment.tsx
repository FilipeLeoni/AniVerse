"use client";

import { DiscussionEmbed } from "disqus-react";
import LazyLoad from "react-lazy-load";

const DisqusComments = ({ animeId, title }: any) => {
  const disqusShortname = "aniverse-4";
  const disqusConfig = {
    url: `http://localhost:3000/anime/details/${animeId}`,
    identifier: `anime-${animeId}`,
    title: title,
  };

  return (
    <LazyLoad>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </LazyLoad>
  );
};

export default DisqusComments;
