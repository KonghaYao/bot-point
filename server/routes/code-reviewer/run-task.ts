import { defineCompose } from "endpoint-kit";
import { z } from "zod";
import { runReviewTask } from "./review";
const schema = z.object({
    id: z.number(),
});
export default defineCompose(
    // CorsLayer(),
    // authLayer(),
    validateJSON(schema),
    async (event) => {
        const body: z.infer<typeof schema> = useJSON(event);
        return runReviewTask({ id: body.id! });
    }
);
