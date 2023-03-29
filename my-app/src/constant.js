const production = process.env.REACT_APP_API_URL_PRODUCTION;
const development = process.env.REACT_APP_API_URL_DEVELOPMENT;
export const API_URL =
  process.env.NODE_ENV === "development" ? development : production;
