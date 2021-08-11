import axios, { AxiosPromise } from 'axios';

export class APIRequest {
  responsePromise: AxiosPromise;
  protected constructor(baseUrl: string, urlExtension: string) {
    this.responsePromise = axios(baseUrl + urlExtension);
  }

  async getContents() {
    const response = await this.responsePromise;
    return response.data;
  }
}
