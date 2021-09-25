import { list_emoji, module_emoji } from '@shine-emojis';
import { preshine } from '@shine-utils';
import { MessageContext } from 'vk-io';
import { Command, ShineCommands } from './index';

export default {
    name: "help",
    desc: "команда помощь хелп скачал",
    aliases: ["help", "помощь"],
    handler(ctx, rctx) {
        const available = ShineCommands.filter(e => e?.storage?.help !== undefined)
        ctx.reply(`${preshine} >> ${list_emoji} список команд\n\n${available.map(e => `${module_emoji} модуль >> ${e.name}\n${e.storage!.help}`).join("\n\n")}`)
    }
} as Command<MessageContext>;