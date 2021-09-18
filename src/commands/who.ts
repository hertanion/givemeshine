
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "who",
    desc: "кто?",
    aliases: ["who", "кто"],
    handler(ctx, rctx) {

    }
} as Command<MessageContext>;