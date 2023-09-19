export const getPopularAnime = async (mediaType: string = "ANIME") => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($mediaType: MediaType) {
            Page(page: 2, perPage: 20) {
              media(sort: POPULARITY_DESC, type: $mediaType) {
                id
                title {
                  romaji
                  english
                  native
                  userPreferred
                }
                bannerImage
                coverImage {
                  extraLarge
                  color
                }
                description
                format
                type
                genres
                averageScore
                popularity
                trending
                favourites
                nextAiringEpisode {
                  airingAt
                  episode
                }
              }
            }
          }
        `,
      variables: {
        mediaType,
      },
    }),
  });

  return response.json();
};

export const getTrendingAnime = async (mediaType: string = "ANIME") => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($mediaType: MediaType) {
              Page(page: 1, perPage: 20) {
                media(sort: TRENDING_DESC, type: $mediaType) {
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  bannerImage
                  coverImage {
                    extraLarge 
                  }
                  description
                  format
                  type
                  genres
                  averageScore
                  popularity
                  trending
                  favourites
                  nextAiringEpisode {
                    airingAt
                    episode
                  }
                }
              }
            }
          `,
      variables: {
        mediaType,
      },
    }),
  });
  return response.json();
};

export const getUpdatedAnime: any = async (mediaType: string = "ANIME") => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($mediaType: MediaType) {
              Page(page: 1, perPage: 20) {
                media(sort: UPDATED_AT_DESC, type: $mediaType) {
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  bannerImage
                  coverImage {
                    extraLarge
                    color
                  }
                  description
                  format
                  type
                  genres
                  averageScore
                  popularity
                  trending
                  favourites
                  nextAiringEpisode {
                    airingAt
                    episode
                  }
                }
              }
            }
          `,
      variables: {
        mediaType,
      },
    }),
  });

  return response.json();
};

export const getFavoriteAnime = async (mediaType: string = "ANIME") => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($mediaType: MediaType) {
              Page(page: 1, perPage: 20) {
                media(sort: FAVOURITES_DESC, type: $mediaType) {
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  bannerImage
                  coverImage {
                    extraLarge
                    color
                  }
                  description
                  format
                  type
                  genres
                  averageScore
                  popularity
                  trending
                  favourites
                  nextAiringEpisode {
                    airingAt
                    episode
                  }
                }
              }
            }
          `,
      variables: {
        mediaType,
      },
    }),
  });

  return response.json();
};

export const getRandomAnime = async () => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
          Page(page: 1, perPage: 20) {
            recommendations {
              media {
                id
                title {
                  romaji
                  english
                  native
                  userPreferred
                }
                bannerImage
                coverImage {
                  extraLarge
                  color
                }
                description
                format
                type
                genres
                averageScore
                popularity
                trending
                favourites
                nextAiringEpisode {
                  airingAt
                  episode
                }
              }
          }
        }
      }
      `,
    }),
  });

  const data = await response.json();

  const recommendations = data.data.Page.recommendations;
  const randomIndex = Math.floor(Math.random() * recommendations.length);

  const randomRecommendedAnime = recommendations[randomIndex].media;
  return randomRecommendedAnime;
};

export const getScheduleAnime = async () => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query AiringSchedule($page: Int = 1, $perPage: Int = 20, $id: Int, $mediaId: Int, $episode: Int, $airingAt: Int, $notYetAired: Boolean, $id_not: Int, $id_in: [Int], $id_not_in: [Int], $mediaId_not: Int, $mediaId_in: [Int], $mediaId_not_in: [Int], $episode_not: Int, $episode_in: [Int], $episode_not_in: [Int], $episode_greater: Int, $episode_lesser: Int, $airingAt_greater: Int, $airingAt_lesser: Int, $sort: [AiringSort]) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          airingSchedules(
            id: $id, mediaId: $mediaId, episode: $episode, airingAt: $airingAt, notYetAired: $notYetAired, id_not: $id_not, id_in: $id_in, id_not_in: $id_not_in, mediaId_not: $mediaId_not, mediaId_in: $mediaId_in, mediaId_not_in: $mediaId_not_in, episode_not: $episode_not, episode_in: $episode_in, episode_not_in: $episode_not_in, episode_greater: $episode_greater, episode_lesser: $episode_lesser, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: $sort
          ) {
            airingAt
            episode
            mediaId
            media {
              bannerImage
              type
              id
              title {
                userPreferred
              }
              coverImage {
                extraLarge
                large
                color
              }
              genres
              favourites
              averageScore
            }
          }
        }
      }
          `,
    }),
  });
  return response.json();
};

export const getAnimeById = async (id: any, type: any) => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($id: Int, $type: MediaType) {
              Media (id: $id, type: $type) {
                id
                title {
                  romaji
                  english
                  native
                  userPreferred
                }
                bannerImage
                coverImage {
                  extraLarge
                  color
                }
                description
                format
                type
                genres
                episodes
                status
                countryOfOrigin
                duration
                averageScore
                popularity
                trending
                favourites
                synonyms
                season
                seasonYear
                relations {
                  nodes {
                    id
                    title {
                      userPreferred
                    }
                    bannerImage
                    coverImage {
                      extraLarge
                      color
                    }
                  averageScore
                    favourites
                    genres
                    description
                    type
                  }
                }

                recommendations {
                  nodes {
                    id
                    mediaRecommendation {
                      id
                      title {
                        userPreferred
                      }
                      bannerImage
                      coverImage {
                        extraLarge
                        color
                      }
                    averageScore
                      favourites
                      genres
                      description
                      type
                    }
                    }
                }

                studios {
                  nodes {
                  id
                  name
                }
              }
              characters {
                edges {
                  node {
                    id
                    image {
                      large
                    }
                    name {
                      userPreferred
                    }
                    
                  }
                  role
                }
              }
                nextAiringEpisode {
                  airingAt
                  episode
                }
              }
          }
      `,
      variables: {
        id,
        type,
      },
    }),
  });

  return response.json();
};
