
import { command_emoji } from '@shine-emojis';
import { preshine } from '@shine-utils';
import fetch from 'node-fetch';
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "lullaby",
    desc: "рандомные картинки из lullaby по методу /anime/pics/lullaby",
    aliases: ["lulpic", "девочка"],
    async handler(ctx, rctx) {
        const pic = await fetch(`https://api.rinki.pw/anime/pics/lullaby`).then(r => r.json());
        const attachment = pic.photos.map((e: any) => e.photo).map((e: any) => `photo${e.owner_id}_${e.id}`).join(',');
        ctx.reply({
            message: `${preshine}\nдержи!`,
            attachment
        });
    },
    storage: {
        help: `${command_emoji} lulpic, девочка - рандомный пост с паблика lullaby(только с картинками, возможна реклама)`
    }
} as Command<MessageContext>