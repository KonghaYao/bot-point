import { ComposeEventHandler } from "~~/packages/endpoint-kit/src";

export const CorsLayer = (): ComposeEventHandler => (event) => {
    setHeader(event, "Access-Control-Allow-Origin", "*");
    setHeader(event, "Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    setHeader(event, "Access-Control-Allow-Headers", "Content-Type");
    
    console.log(event.method);
    if (event.method.toUpperCase() === "OPTIONS") {
        setResponseStatus(event, 200);
        return "ok";
    }
};
