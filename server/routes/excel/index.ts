import { defineCompose } from "endpoint-kit";
import { TextWrapper } from "~/utils/JSONWrapper";
export default defineCompose(async (event) => {
    const data = await useStorage("assets:server").getItem(`excel.html`);
    return TextWrapper(data.toString());
});
