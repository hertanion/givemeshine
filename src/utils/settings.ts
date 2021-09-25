import { __projname } from "@shine-utils";
import { API, VK } from "vk-io";
import jsonr from '@shine-json';

const defaults_config = {
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
};

export const settings = Object.assign({}, jsonr, defaults_config);
export const account = new VK({ token: settings.account.token.full_access });
export const vk_me_api = new API({ token: settings.account.token.vk_me });