export const searchData = async (
  search: string,
  mediaType: string = "ANIME"
) => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query ($search: String, $mediaType: MediaType, ) {
            Page(page: 1, perPage: 30) {
              media(search: $search, type: $mediaType, sort: TRENDING_DESC) {
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
                trailer {
                  id
                }
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
        search,
      },
    }),
  });

  return response.json();
};

export const getPopularMedia = async (mediaType: string = "ANIME") => {
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
                trailer {
                  id
                }
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

export const getTrendingMedia = async (mediaType: string = "ANIME") => {
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
                    color
                  }
                  description
                  format
                  type
                  genres
                  averageScore
                  popularity
                  trending
                  trailer {
                    id
                  }
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

export const getUpdatedMedia: any = async (mediaType: string = "ANIME") => {
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
                  trailer {
                    id
                  }
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

export const getFavoriteMedia = async (mediaType: string = "ANIME") => {
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
                  trailer {
                    id
                  }
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

export const getRandomMedia = async () => {
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
                trailer {
                  id
                }
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

  const randomRecommendedMedia = recommendations[randomIndex].media;
  return randomRecommendedMedia;
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
                nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode 
                }
                airingSchedule {
                  nodes {
                    airingAt
                    timeUntilAiring
                    episode
                  }
                }
                tags {
                  id
                  name
                  description
                  category
                  rank
                  isGeneralSpoiler
                  isMediaSpoiler
                  isAdult
                  userId
                }
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
                      full
                    }
                    dateOfBirth {
                      day
                      month
                    }
                    age
                    gender
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

// export const getCharacterById = async (id: string) => {
//   const response: any = await fetch(`https://graphql.anilist.co`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },

//     body: JSON.stringify({
//       query: `
//       query ($id: Int) {
//         Character (id: $id) {
//           id
//           name {
//             full
//             native
//             alternative
//           }
//           image {
//             large
//           }
//           description
//           siteUrl
//           favourites
//           isFavourite
//           media {
//             nodes {
//               id
//               title {
//                 userPreferred
//               }
//               bannerImage
//               coverImage {
//                 extraLarge
//                 color
//               }
//               averageScore
//               favourites
//               genres
//               description
//               type
//             }
//           }
//         }
//       }
//       `,
//       variables: {
//         id,
//       },
//     }),
//   });
//   console.log(response);
//   return response.json();
// };

export const charactersDefaultFields = `
id
name {
  first
  middle
  last
  full
  native
  alternative
  alternativeSpoiler
  userPreferred
}
image {
  large
  medium
}
description
gender
dateOfBirth {
  year
  month
  day
}
age
bloodType
updatedAt
favourites
`;

export const mediaDefaultFields = `
id
type
title {
  userPreferred
}
coverImage {
  extraLarge
  large
  color
}
startDate {
  year
  month
  day
}
endDate {
  year
  month
  day
}
bannerImage
season
seasonYear
description
type
format
status(version: 2)
episodes
duration
chapters
volumes
favourites
trending
genres
isAdult
averageScore
popularity
trailer {
  id
  site 
}
nextAiringEpisode {
  airingAt
  episode
}
`;

export const getCharacterDetails = async (id: any) => {
  const response: any = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify({
      query: `
      query ($id: Int) {
        Character (id: $id) {
          ${charactersDefaultFields}
      
        }
      }
      `,
      variables: {
        id,
      },
    }),
  });

  const test = await response.json();
  console.log(test.data);
  return test.data;
};
