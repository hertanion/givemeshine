
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "random",
    desc: "рандомное число",
    aliases: ["rand", "ранд"],
    handler(ctx, rctx) {

    }
} as Command<MessageContext>