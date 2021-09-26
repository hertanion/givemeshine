
import { MessageContext } from 'vk-io';
import { Command } from './index';
import canvas from 'canvas';
import { preshine, ShineAttach, __projname } from '@shine-utils';
import { command_emoji, not_passed_emoji } from '@shine-emojis';
import { account } from '@shine-settings';

canvas.registerFont(`${__projname}/assets/fonts/tnr.ttf`, { family: 'Times New Roman' });
canvas.registerFont(`${__projname}/assets/fonts/arial.ttf`, { family: 'arial' });    

interface DemotivatorOptions {
    text: string;
    text_small?: string;
    url: string;
};

export async function createdemotivator(settings: DemotivatorOptions) {
    let c = canvas.createCanvas(1000, 1000);
    let context = c.getContext("2d");
    let img = await canvas.loadImage(settings.url);
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillRect(0, 0, 1000, 1000);
    context.fillStyle = "white";
    context.fillRect(100, 40, 800, 700);
    context.fillStyle = "black";
    context.fillRect(104, 44, 792, 692);
    context.drawImage(img, 108, 48, 784, 684);
    context.fillStyle = "white";
    context.font = "84px Times New Roman";
    if(settings.text_small) {
        context.fillText(settings.text, 500, 860, 800);
        context.font = "48px arial";
        context.fillText(settings.text_small, 500, 920);
    } else {
        context.fillText(settings.text, 500, 870, 800);
    }
    return c.toBuffer("image/jpeg");
};

export default {
    name: "demotivator",
    desc: "делать дем мееем",
    aliases: ["dem", "дем"],
    async handler(ctx, rctx) {
        
        if(!ctx.text) return ctx.reply(`${preshine}\n${not_passed_emoji} текст демотиватора не найден!`);
        let [text,text_small] = ctx.text.split("/");
        let [photo] = await ShineAttach.getAttachments(ctx, "photo");
        if(!photo) return ctx.reply(`${preshine}\n${not_passed_emoji} вы не прикрепили фото`);
        
        ctx.reply("подождите...");
        let demotivatorlike = await createdemotivator({
            url: photo.largeSizeUrl!,
            text,
            text_small
        });

        const demattach = await account.upload.messagePhoto({
            peer_id: ctx.peerId,
            source: {
                timeout: 1e3 * 60,
                value: demotivatorlike
            }
        });
        ctx.reply({
            message: "держи демотиватор",
            attachment: demattach
        });
    },
    storage: {
        help: `${command_emoji} dem, дем - создать демотиватор`
    }
} as Command<MessageContext>;
