import axios from 'axios';
export class Util {
  static async getData(baseUrl: string, urlExtension: string) {
    const response = await axios(baseUrl + urlExtension);
    return response.data;
  }
}
