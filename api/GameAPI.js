import axios from "axios";

const RESPONSE_MESSAGE = {
  success: "success",
  incorrectGuess: "incorrect guess",
};

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GOOGLE_APP_ENGINE_BASE_URL,
});

const errorHandler = (error) => {
  console.log("error handler ->", error);
  const { status: statusCode } = error?.response;

  if (statusCode && statusCode !== 400) {
    console.error("Uncaught error", error);
  }

  return Promise.reject(error);
};

baseAPI.interceptors.response.use(
  (response) => {
    const message = response.data?.message;
    switch (message) {
      case RESPONSE_MESSAGE.incorrectGuess:
        const word = response.data?.word;
        return Promise.reject({
          reason: RESPONSE_MESSAGE.incorrectGuess,
          word,
        });
      default:
        return response;
    }
  },
  (error) => {
    return errorHandler(error);
  }
);

export const GameAPI = {
  /**
   * Fetchs an array of games as strings.
   * @returns {Promise<string[]>} - A promise that resolves to an array of strings.
   */

  getGames: async () => {
    const { data } = await baseAPI.request({
      url: `/game-numbers/`,
      method: "GET",
    });
    return data;
  },

  /**
   * Get the position of a word for a specific gameNumber.
   * @param {string} word - The word for which you want to retrieve the position.
   * @param {string} date - The gameNumber for which you want to retrieve the word's position.
   * @returns {Promise<{ word: string, pos: number }>} A promise that resolves to an object
   */

  getWordPosForGame: async (word, gameNumber) => {
    try {
      const { data } = await baseAPI.request({
        url: `/gameNumber/${gameNumber}/word/${word}`,
        method: "GET",
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a mystery token from the API for a mystery date.
   * @returns {Promise<Buffer>} A promise that resolves to a mystery token in UTF-8 encoding.
   */

  getMysteryToken: async () => {
    const { data } = await baseAPI.request({
      url: `/mystery-game-number/token`,
      method: "GET",
    });
    return data;
  },

  /**
   * Get the position of a word for a mystery date using a provided access token.
   *
   * @param {string} word - The word for which you want to retrieve the position.
   * @param {string} token - The access token used to authenticate the request.
   * @returns {Promise<{ word: string, pos: number }>} A promise that resolves to an object
   * containing the word and its position.
   */

  getWordPosForMysteryDate: async (word, token) => {
    const { data } = await baseAPI.request({
      url: `/mystery-game/word/${word}`,
      method: "GET",
      headers: {
        "R-Auth": token,
      },
    });

    return data;
  },

  /**
   * Return the top 100 words
   *
   * @param {string} level - The level from which you want to grab top levels from
   * @returns {Promise<[{ word: string, pos: number }]>} A promise that resolves to an array of objects with word and pos
   */

  getTop100ForLevel: async (level) => {
    const { data } = await baseAPI.request({
      url: `/level/${level}/top100`,
      method: "GET",
    });
    return data;
  },
};
