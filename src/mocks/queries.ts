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
                media(sort: UPDATED_AT_DESC, type: ANIME) {
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
