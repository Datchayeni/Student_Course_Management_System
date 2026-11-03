// Single shared Axios client (base URL + JWT interceptor live in api/apiClient.js).
// Kept as a re-export so existing `import api from "../services/api"` lines still work.
export { default } from "../api/apiClient";
