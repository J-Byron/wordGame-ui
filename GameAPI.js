import axios from "axios";

const baseAPI = axios.create({
  baseURL: "https://flash-crawler-400019.ue.r.appspot.com",
});

const errorHandler = (error) => {
  const statusCode = error.response?.status;

  if (statusCode && statusCode !== 401) {
    console.error(error);
  } else {
  }

  return Promise.reject(error);
};

baseAPI.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

export const GameAPI = {
  /**
   * Fetchs an array of Dates (MMDDYYYY) as strings.
   * @returns {Promise<string[]>} - A promise that resolves to an array of strings.
   */

  getGameDates: async () => {
    const { data } = await baseAPI.request({
      url: `/game-dates/`,
      method: "GET",
    });
    return data;
  },

  /**
   * Get the position of a word for a specific date.
   * @param {string} word - The word for which you want to retrieve the position.
   * @param {string} date - The date for which you want to retrieve the word's position.
   * @returns {Promise<{ word: string, pos: number }>} A promise that resolves to an object
   */

  getWordPosForDate: async (word, date) => {
    const { data } = await baseAPI.request({
      url: `/day/${date}/word/${word}`,
      method: "GET",
    });

    return data;
  },

  /**
   * Get a mystery token from the API for a mystery date.
   * @returns {Promise<Buffer>} A promise that resolves to a mystery token in UTF-8 encoding.
   */

  getMysteryToken: async () => {
    const { data } = await baseAPI.request({
      url: `/mystery-date/token`,
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
      url: `/mystery-date/word/${word}`,
      method: "GET",
      Headers: {
        "X-Access-Token": token,
      },
    });

    return data;
  },
};
