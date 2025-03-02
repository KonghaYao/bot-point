import { defineCompose } from "endpoint-kit";
import { TextWrapper } from "~/utils/JSONWrapper";

export default defineCompose(async (event) => {
    return TextWrapper("欢迎使用 bot-point 智能 AI 函数");
});
