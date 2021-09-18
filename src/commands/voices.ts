
import Voice from '@model-voice';
import { preshine } from '@shine-utils';
import { MessageContext } from 'vk-io';
import { Command } from './index';

export default {
    name: "voices",
    desc: "управление войсами",
    aliases: ["voices", "войсы", "добавить войс", "add voice", "удалить войс", "delete voice", "войс", "voice"],
    async handler(ctx, rctx) {
        
        const prevoice = `<< войсы >>`;
        
        switch (rctx.called) {
            case 'войс':
            case 'voice':
                const voicef = await Voice.find(ctx.text);
                ctx.send(`${preshine}\n${prevoice}\n${voicef ? `${voicef.id} <> ${voicef.name} <> ${voicef.data}` : 'не найден!'}`);
                break;
            case 'добавить войс':
            case 'add voice':

                const addargs = ctx.text?.match(/^([a-zA-Zа-яА-Я0-9_-]+)\s+(.+)/);
                // console.log(addargs, ctx.text);
                if (!addargs) return ctx.reply(`${preshine}\n${prevoice}\nнет аргументов или ошибка при парсе`);

                const [ , name, data ] = addargs;
                const TryAdd = await Voice.add(name, data);
                
                if (!TryAdd) return ctx.reply(`${preshine}\n${prevoice}\nвойс не был добавлен т.к такое имя уже существует в базе`);
                ctx.reply(`${preshine}\n${prevoice}\nвсе четка дабавил`);
                
                break;
            default:
                const voicesAll = await Voice.findAll();
                const list = voicesAll.map((VoiceMod, i) => `${i+1} =name> ${VoiceMod.name} =data> ${VoiceMod.data}`).join('\n')
                ctx.reply(`${preshine}\n${prevoice}\n${list.length > 0 ? list : "пуста вырасла капуста ХАХА"}`)
                break;
        }

    }
} as Command<MessageContext>