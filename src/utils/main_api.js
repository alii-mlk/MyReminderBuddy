import { MAIN_API_ADDRESS } from "./config";
import { APIWrapper } from "./api_wrapper";
class MainApiWrapper extends APIWrapper {

}
const mainApi = new MainApiWrapper({
    baseUrl: MAIN_API_ADDRESS,
});
export const MAIN_API = mainApi;