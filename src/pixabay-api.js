'use strict';

import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31530829-0eb4b5ab815420784883b782b';

  constructor() {
    this.page = null;
    this.searchQuery = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        q: this.searchQuery,
        page: this.page,
        per_page: '40',
        orientation: "horizontal",
        key: this.#API_KEY,
        safesearch: "true",
        image_type: "photo"
      },
    };

    return axios.get(this.#BASE_URL, searchParams);
  }
}
