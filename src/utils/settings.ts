import { __projname } from "@shine-utils";
import Database from "./database";

export default new Database({
    path: `${__projname}/shine.settings.json`,
    default_config: {
        "bot": {
            "prefix": "shine",
            "prefix_as_name": true,
            "allowed": [],
        },
        "account": {
            "name": "shine-account",
            "token": {
                "full_access": "<token>",
                "vk_me": "<token>"
            }
        },
        "database": {
            "dialect": "sqlite",
            "storage": "shine.data"
        }
    },
    autoupdate: true
});