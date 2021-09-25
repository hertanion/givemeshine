
import { not_passed_emoji } from '@shine-emojis';
import { account } from '@shine-settings';
import { preshine, random, sendCopyWith } from '@shine-utils';
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "who",
    desc: "кто?",
    aliases: ["who", "кто"],
    async handler(ctx, rctx) {
        if(!ctx.isChat) return ctx.reply("команда доступна только в беседах");
        let messageWithMention = function(who: string) {
            let answers = [
                'это @id{insertuser}',
                'наверное это @id{insertuser}',
                'скорее всего это @id{insertuser}',
                'может это @id{insertuser}?',
                'я считаю это @id{insertuser}',
                'мой ответ - @id{insertuser}',
                'это явно @id{insertuser}',
                'эя эя эяйо @id{insertuser}',
            ];
            let ans = answers[random(answers.length)];
            ans = ans.replace('{insertuser}', who);
            return ans;
        };
        let chat = await account.api.messages.getConversationMembers({
            peer_id: ctx.peerId
        });
        if (!chat) return ctx.reply({ message: `${preshine}\n${not_passed_emoji} не могу получить беседу :(` })
        if(chat!.profiles!.length < 2) return ctx.reply({ message: `${preshine}\n${not_passed_emoji} в беседе должно быть минимум 2 участника!` });
        const profile = chat!.profiles![random(chat!.profiles!.length)];
        ctx.reply({ message: messageWithMention(`${profile.id}(${profile.first_name} ${profile.last_name})`) });
    }
} as Command<MessageContext>;