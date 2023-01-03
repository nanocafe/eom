import axios from "axios";

const TIMEOUT = 1000 * 30 // 30 seconds

function createAPI(baseURL: string, timeout = TIMEOUT) {

  const api: any = axios.create({ baseURL, timeout })

  // Add a response interceptor
  api.interceptors.response.use(function (response: any) {

    // Any status code that lie within the range of 2xx cause this function to trigger

    return response.data


  }, function (error: any) {

    console.error(error)

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.response) {

      throw (
        typeof error.response.data === "object" && "message" in error.response.data
            ? error.response.data.message
            : "Invalid server response"
      )

    } else if (error.request) {

      throw ("No response from server")  // The request was made but no response was received

    } else {

      throw (error.message)  // Something happened in setting up the request that triggered an Error

    }

  });

  return api;
}

const API = createAPI("/api")

export default API;