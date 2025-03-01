import { defineCompose } from "endpoint-kit";
import { createCRUD } from "../../utils/createCRUD";
import { tasksTable } from "~/db/schema";

const { schema, handler } = createCRUD("tasksTable", tasksTable);
export default defineCompose(
    // CorsLayer(),
    // authLayer(),
    validateJSON(schema),
    handler
);
