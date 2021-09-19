import { __projname } from "@shine-utils";
import { API, VK } from "vk-io";
import Database from "./database";
import sjson from '@shine-json';

export default new Database({
    path: `${__projname}/shine.settings.json`,
    default_config: {
        "bot": {
            "prefix": "shine",
            "prefix_as_name": true,
            "allowed": []
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

export const account = new VK({ token: sjson.account.token.full_access });
export const vk_me_api = new API({ token: sjson.account.token.vk_me });