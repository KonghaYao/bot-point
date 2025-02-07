//https://nitro.unjs.io/config
export default defineNitroConfig({
    srcDir: "server",
    compatibilityDate: "2025-02-06",
    preset: "netlify-edge",
    runtimeConfig: {
        NITRO_BOTPOINT_TOKEN: process.env.NITRO_BOTPOINT_TOKEN,
        NITRO_OPENAI_API_BASE_URL: process.env.NITRO_OPENAI_API_BASE_URL,
        NITRO_OPENAI_API_KEY: process.env.NITRO_OPENAI_API_KEY,
    },
});
