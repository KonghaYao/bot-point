import { defineCompose } from "endpoint-kit";
import { z } from "zod";

const schema = z.object({
    name: z.string(),
    age: z.number().min(0),
});

export default defineCompose(
    validateJSON(schema),
    defineAI({
        getPrompt(event) {
            const json: z.infer<typeof schema> = useJSON(event)
            return `Hello ${json.name}, you are ${json.age} years old.`
        },

    })
)