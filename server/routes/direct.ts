import { defineCompose } from "endpoint-kit";
import { z } from "zod";
import { CorsLayer } from "~/utils/cors";
const schema = z.object({
    prompt: z.string(),
});

export default defineCompose(
    CorsLayer(),
    // authLayer(),
    validateJSON(schema),

    async (event) => {
        return defineAI({
            onlyJson: true,

            getPrompt(event) {
                const json: z.infer<typeof schema> = useJSON(event);
                return json.prompt;
            },
        })(event);
    }
);
