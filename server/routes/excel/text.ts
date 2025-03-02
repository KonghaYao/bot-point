import { defineCompose } from "endpoint-kit";
import { z } from "zod";

const schema = z.object({
    prompt: z.string(),
    system: z.string().optional(),
});

export default defineCompose(
    CorsLayer(),
    // authLayer(),
    validateJSON(schema),
    defineAI({
        getSystem(event, isStream) {
            const json: z.infer<typeof schema> = useJSON(event);
            return json.system;
        },
        getPrompt(event) {
            const json: z.infer<typeof schema> = useJSON(event);
            return "" + json.prompt;
        },
    })
);
