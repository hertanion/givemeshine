
import Voice from '@model-voice';
import { command_emoji, list_emoji, not_passed_emoji, passed_emoji } from '@shine-emojis';
import { preshine, sendCopyWith, ShineAttach } from '@shine-utils';
import fetch from 'node-fetch';
import { account } from '@shine-settings';
import urlRegex from 'url-regex';
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "voices",
    desc: "управление войсами",
    aliases: ["voices", "войсы", "добавить войс", "add voice", "удалить войс", "delete voice", "войс", "voice"],
    async handler(ctx, rctx) {
        
        const prevoice = `${list_emoji} войсы`;
        
        switch (rctx.called) {
            case 'войс':
            case 'voice':
                
                const voice = await Voice.find(ctx.text);
                if (!voice) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} войс не найден!`);

                try {
                    const uploadedAudio = await account.upload.audioMessage({ source: { value: Buffer.from(voice.data, "base64") } });
                    sendCopyWith(ctx, { attachment: uploadedAudio });
                    ctx.deleteMessage({ delete_for_all: ctx.peerId === ctx.senderId ? 0 : 1 });
                } catch (err) {
                    ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} ошибка загрузки!`);
                };
                break;

            case 'добавить войс':
            case 'add voice':

                const __addargs = ctx.text?.match(/^([a-zA-Zа-яА-Я0-9_-]+)\s*(.*)/);
                if (!__addargs) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} нет аргументов или ошибка при парсе!`);

                let [ , addName, addData ] = __addargs;
                let audio = await ShineAttach.getAttachments(ctx, "audio_message");
                if (audio.length > 1) return ctx.reply(`${preshine}\n${prevoice}\n${list_emoji} найдено ${audio.length} голосовых сообщений!\n\n${audio.map((e,i) => `> голосовое #${i+1}\n> ${e.oggUrl}`).join('\n\n')}\n\nпожалуйста, выберите ссылку голосового и добавьте его`);
                if (audio.length === 1) addData = audio[0]!.oggUrl || '';

                if (!urlRegex({ exact: true }).test(addData)) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} аргумент не является ссылкой!`);

                try {
                    const fetchedAudio = await fetch(addData)
                    if (fetchedAudio.headers.get('content-type') !== 'audio/ogg') return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} тип контента не audio/ogg!`);
                    const audioInBase64 = await fetchedAudio.buffer().then(buf => buf.toString('base64'));
                    const addResponse = await Voice.add(addName, audioInBase64);
                    if (!addResponse) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} войс не был добавлен т.к такое название уже существует в базе!`);
                    ctx.reply({ message: `${preshine}\n${prevoice}\n${passed_emoji} голосовое было добавлено в базу под названием "${addName}"!`});
                } catch (err) {
                    ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} ошибка конвертации в base64!`);
                }
                break;
                
            case 'delete voice':
            case 'удалить войс':

                const isRemovered = await Voice.remove(ctx.text || '');
                if (!isRemovered) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} такого голосового нет в базе!`);
                ctx.reply({ message: `${preshine}\n${prevoice}\n${passed_emoji} голосовое успешно удалено!` });
                break;

            default:
                
                const voicesAll = await Voice.findAll();
                const list = voicesAll.map((VoiceMod, i) => `${i+1} || ${VoiceMod.name} || Сохранено в base64`).join('\n');
                ctx.reply({ message: `${preshine}\n${prevoice}\n${list.length > 0 ? list : `${not_passed_emoji} >> у вас пока нет войсов!`}` });
                break;

        }

    },
    storage: {
        help: `${command_emoji} войсы, voices - просмотр войсов\n${command_emoji} добавить войс, add voice - добавляет войс по ссылке или прикрепленному сообщению\n${command_emoji} удалить войс, remove voice - удаляет войс по его названию\n${command_emoji} войс, voice - получает войс по его названию`
    }
    
} as Command<MessageContext>;