/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_WEB_APP_URL: string;
  // add more environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
