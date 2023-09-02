export const getPopularAnime = async () => {
  const response = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
          query {
            Page(page: 2, perPage: 20) {
              media(sort: POPULARITY_DESC, type: ANIME) {
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
    }),
  });

  return response.json();
};

export const getTrendingAnime = async () => {
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
                media(sort: TRENDING_DESC, type: ANIME) {
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
    }),
  });

  return response.json();
};

export const getUpdatedAnime = async () => {
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
                media(sort: UPDATED_AT, type: ANIME) {
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
    }),
  });

  return response.json();
};

export const getFavoriteAnime = async () => {
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
                media(sort: FAVOURITES_DESC, type: ANIME) {
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
