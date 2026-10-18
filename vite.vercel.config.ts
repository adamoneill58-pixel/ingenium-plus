import vinext from "vinext";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: process.env.CODEX_SANDBOX === "seatbelt"
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  plugins: [vinext(), ...(command === "build" ? [nitro()] : [])],
}));
