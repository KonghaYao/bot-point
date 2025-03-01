import { defineCompose } from "endpoint-kit";
import { createCRUD } from "../../utils/createCRUD";
import { reviewAgentTable } from "~/db/schema";

const { schema, handler } = createCRUD("reviewAgentTable", reviewAgentTable);
export default defineCompose(
    // CorsLayer(),
    // authLayer(),
    validateJSON(schema),
    handler
);
