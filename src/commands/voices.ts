
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
                const voicef = await Voice.find(ctx.text);
                if (!voicef) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} войс не найден!`);

                try {
                    const audiomsg = await account.upload.audioMessage({ source: { value: Buffer.from(voicef.data, "base64") } })
                    sendCopyWith(ctx, { attachment: audiomsg });
                    ctx.deleteMessage({ delete_for_all: ctx.peerId === ctx.senderId ? 0 : 1 });
                } catch (err) {
                    ctx.send(`${preshine}\n${prevoice}\n${not_passed_emoji} ошибка загрузки!`)  
                };
                break;
            case 'добавить войс':
            case 'add voice':

                const addargs = ctx.text?.match(/^([a-zA-Zа-яА-Я0-9_-]+)\s*(.*)/);
                if (!addargs) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} нет аргументов или ошибка при парсе!`);

                let [ , name, data ] = addargs;
                let audio = await ShineAttach.getAttachments(ctx, "audio_message");

                if (audio.length > 1) return ctx.reply(`${preshine}\n${prevoice}\n${list_emoji} найдено ${audio.length} голосовых сообщений!\n\n${audio.map((e,i) => `> голосовое #${i+1}\n> ${e.oggUrl}`).join('\n\n')}\n\nпожалуйста, выберите ссылку голосового и добавьте его`);
                if (audio.length === 1) data = audio[0]!.oggUrl || '';

                if (!urlRegex({ exact: true }).test(data)) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} аргумент не является ссылкой!`);

                try {
                    const getit = await fetch(data)
                    if (getit.headers.get('content-type') !== 'audio/ogg') return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} тип контента не audio/ogg!`);
                    const audiobase64 = await getit.buffer().then(buf => buf.toString('base64'));
                    const TryAdd = await Voice.add(name, audiobase64);
                    if (!TryAdd) return ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} войс не был добавлен т.к такое название уже существует в базе!`);
                    ctx.reply(`${preshine}\n${prevoice}\n${passed_emoji} голосовое было добавлено в базу под названием "${name}"!`);
                } catch (err) {
                    ctx.reply(`${preshine}\n${prevoice}\n${not_passed_emoji} ошибка конвертации в base64!`);
                }
                break;
            default:
                const voicesAll = await Voice.findAll();
                const list = voicesAll.map((VoiceMod, i) => `${i+1} || ${VoiceMod.name} || Сохранено в base64`).join('\n')
                ctx.reply(`${preshine}\n${prevoice}\n${list.length > 0 ? list : `${not_passed_emoji} >> у вас пока нет войсов!`}`)
                break;
        }

    },
    storage: {
        help: `\t${command_emoji} войсы, voices - просмотр войсов\n\t${command_emoji} добавить войс, add voice - добавляет войс по ссылке или прикрепленному сообщению\n\t${command_emoji} удалить войс, remove voice - удаляет войс по его названию\n\t${command_emoji} войс, voice - получает войс по его названию`
    }
    
} as Command<MessageContext>;