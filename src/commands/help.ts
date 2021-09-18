import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "help",
    desc: "команда помощь хелп скачал",
    aliases: ["help", "помощь"],
    handler(ctx, rctx) {

    }
} as Command<MessageContext>