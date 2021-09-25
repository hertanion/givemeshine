
import { formatDate, preshine, sendCopyWith, shine_build } from '@shine-utils';
import { MessageContext } from 'vk-io';
import { Command, RiveContext } from './index';
import project from '@shine-project';
// import project from '@shine-settings';

export default {
    name: "ping",
    desc: "пинг бота и стата",
    aliases: ["ping", "пинг"],
    handler(ctx: MessageContext, rctx: RiveContext) {
        sendCopyWith(ctx,{ message: `${preshine}\n\nбилд шайни создан: ${formatDate(new Date(shine_build.createdAt)).full}\nпоследняя сборка: ${formatDate(new Date(shine_build.builded)).full}\nверсия: ${project.version}`, attachment: "doc261408301_591794406" });
    }
} as Command<MessageContext>;