import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
    REDIS_HOST: str(),
    REDIS_PORT: port(),

    MAIL_HOST: str(),
    MAIL_PORT: port(),

    MAIL_USER: str(),
    MAIL_PASS: str(),
});