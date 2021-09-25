
import { MessageContext } from 'vk-io';
import { Command } from './index';
import canvas from 'canvas';
import { preshine, ShineAttach, tonumber } from '@shine-utils';
import { not_passed_emoji } from '@shine-emojis';
import { account } from '@shine-settings';

export default {
    name: "jpeg",
    desc: "жмем картинки",
    aliases: ["jpeg", "жпег"],
    async handler(ctx, rctx) {

        let jpeg_quality = tonumber(ctx.text) || 0.25;
        let [photo] = await ShineAttach.getAttachments(ctx, "photo");
        
        if(!photo) return ctx.reply(`${preshine}\n${not_passed_emoji} вы не прикрепили фото`);
        const max_photo = photo!.sizes![photo!.sizes!.length-1];
        let c = canvas.createCanvas(max_photo.width, max_photo.height);
        let context = c.getContext("2d");
        let img = await canvas.loadImage(max_photo.url);
        context.drawImage(img, 0, 0, max_photo.width, max_photo.height);
        const jpeg_photo = await account.upload.messagePhoto({
            peer_id: ctx.peerId,
            source: {
                timeout: 1e3 * 120,
                value: c.toBuffer("image/jpeg", {
                    quality: jpeg_quality
                }),
                contentType: 'image/jpeg',
                filename: 'zxcshine.jpg'
            }
        });
        ctx.reply({
            message: `${preshine}\nдержи! jpeg_quality => ${jpeg_quality}`,
            attachment: jpeg_photo
        }); 
    }
} as Command<MessageContext>;