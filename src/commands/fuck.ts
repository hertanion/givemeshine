
import { MessageContext } from 'vk-io';
import { Command } from './index';
import { preshine, sendCopyWith } from '@shine-utils'
import { module_emoji, not_passed_emoji, passed_emoji } from '@shine-emojis';

export default {
    name: "fuck",
    desc: "ебаться в жопу",
    aliases: ["fuck", "трах", "трахать"],
    handler(ctx, rctx) {

        switch (rctx.called) {
            case 'трахать':
                if (!ctx.hasReplyMessage) return sendCopyWith(ctx, { message: `${preshine}\n${not_passed_emoji} ответьте на сообщение\n"да" - включить, другое - отключить` }) 
                const st = ctx.text === 'да' ? true : false;
                this.storage!.traxat.set(ctx.replyMessage!.senderId, st);
                ctx.reply({ message: `${preshine}\n${st ? `${passed_emoji} ` : `${not_passed_emoji} не ` }будем трахать` });
                break;
        
            default:
                ctx.reply({ message: `${preshine}\n${module_emoji} ${this.name}\n\n${this.storage!.help}`})
                break;
        };

    },
    storage: {
        help: `fuck, трах - трахать пользователя\nтрахать - ставим трахалку автоматом`,
        traxat: new Map(),
        timeouts: new Map(),
        onMessage(ctx, mrctx) {
            const { traxat, timeouts } = this;
            if (traxat.has(ctx.senderId) && traxat.get(ctx.senderId) == true && !mrctx.isMe) {
                if (timeouts.has(ctx.senderId) && Date.now() - timeouts.get(ctx.senderId) <= 2.5) return;
                timeouts.set(ctx.senderId, Date.now());
                ctx.reply('а шайни сказал трахать тебя');
            }
        }
    }
} as Command<MessageContext>;