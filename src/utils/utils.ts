
import { statSync } from 'fs';
import { dirname } from 'path';
import { API, AttachmentType, AttachmentTypeString, AudioAttachment, AudioMessageAttachment, DocumentAttachment, getRandomId, GiftAttachment, GraffitiAttachment, LinkAttachment, MarketAlbumAttachment, MarketAttachment, MessageContext, PhotoAttachment, PollAttachment, StickerAttachment, StoryAttachment, VideoAttachment, WallAttachment, WallReplyAttachment } from 'vk-io';
import { shine_emoji } from '@shine-emojis';

export const __projname = dirname(__dirname);
export const isAsync = (f: any) => f[Symbol.toStringTag] === 'AsyncFunction';


export class KotObjects {
    
    static splitPath(path: string): Array<string> { return path.split('/').filter(v => v.length > 0); };
    
    static set(obj: any, path: string, ins: any, setidx: boolean = false) {
        
        const paths = KotObjects.splitPath(path);
        let _here = obj; 

        if (paths.length <= 0) {
            if (typeof _here !== 'object' || _here === null ) throw new Error(`[KotObjects] [path:'/'] Expected, that "obj" type is object, but it "${typeof _here}"`);
            if (setidx) return _here.__index = ins;
            return Object.assign(_here, ins);
        };

        for (let _k in paths) {
            
            const k = Number(_k).valueOf();
            const v = paths[k];
            const r = paths.slice(0,k+1).join('/');
            const isLast = k === paths.length - 1;
            const isObject = (v: any) => typeof v === 'object';
            
            if ( _here[v] === undefined || _here[v] === null ) _here[v] = {};
            if (!isObject(_here[v])) throw new Error(`[KotObjects] [path:'${r}'] Expected, that property type "${v}" is object, but it "${typeof _here[v]}"`);
            
            if ( isLast ) {
                if (setidx) return Object.assign(_here[v], { __index: ins });
                return Object.assign(_here[v], ins);
            } else {
                _here = _here[v];
            };

        };

    };

    static get(obj: any, path: string, getidx: boolean = false) {
        
        const paths = KotObjects.splitPath(path);
        let _return = obj; 

        for (let _k in paths) {
            
            const k = Number(_k).valueOf();
            const v = paths[k];
            const r = paths.slice(0,k+1).join('/');
            const isLast = k === paths.length - 1;
            const isObject = typeof _return[v] === 'object';

            if ( _return[v] !== undefined || _return[v] !== null ) {
                if (isLast) return getidx && isObject && ( _return[v].hasOwnProperty('__index') ) ? _return[v].__index : _return[v];
                if (!isObject) throw new Error(`[KotObjects] [path:'${r}'] Expected, that property type "${v}" is object, but it "${typeof _return[v]}"`);
                _return = _return[v];
            } else {
                return _return[v];
            };
            
        };
        
        return getidx && typeof _return === 'object' && ( _return.hasOwnProperty('__index') ) ? _return.__index : _return;

    };

};

export class ShineAttach {
    static async getAttachments(ctx: MessageContext, type: AttachmentType.AUDIO | 'audio'): Promise<AudioAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.AUDIO_MESSAGE | 'audio_message'): Promise<AudioMessageAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.GRAFFITI | 'graffiti'): Promise<GraffitiAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.DOCUMENT | 'doc'): Promise<DocumentAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.MARKET_ALBUM | 'market_album'): Promise<MarketAlbumAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.MARKET | 'market'): Promise<MarketAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.PHOTO | 'photo'): Promise<PhotoAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.STORY | 'story'): Promise<StoryAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.VIDEO | 'video'): Promise<VideoAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.WALL | 'wall'): Promise<WallAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.POLL | 'poll'): Promise<PollAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.GIFT | 'gift'): Promise<GiftAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.LINK | 'link'): Promise<LinkAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.STICKER | 'sticker'): Promise<StickerAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: AttachmentType.WALL_REPLY | 'wall_reply'): Promise<WallReplyAttachment[]>;
    static async getAttachments(ctx: MessageContext, type: any): Promise<any[]> {
        
        const attachments: any[] = [];

        async function seek(enter: MessageContext) {
            await enter.loadMessagePayload({ force: true });
            if(enter.hasAttachments(type as AttachmentTypeString)) attachments.push( ... enter.getAttachments( type ) );
            if(enter.hasReplyMessage) await seek(enter.replyMessage!);
            if(enter.hasForwards) for (let forward of enter.forwards) await seek(forward);
        };
        await seek(ctx);
        return attachments;
        
    };
};

export async function sendCopyWith(ctx: MessageContext, options: any = {}, api?: API) {
    const standart: any = { }
    if(ctx.hasReplyMessage) standart.reply_to = ctx.replyMessage!.id
    if(ctx.hasAttachments()) standart.attachment = ctx.attachments;
    const message_options = Object.assign(standart, {
        peer_id: ctx.peerId, random_id: getRandomId()
    }, options);
    if(api) return api.messages.send(message_options);
    ctx.send(message_options);
};

const shine_build_raw = statSync(`${__projname}/build/shine.js`)

// interfaces
export interface IFormatedDate {
    readonly sec: number;
    readonly ms: number;
    readonly date: string;
    readonly time: string;
    readonly full: string;
    readonly __dateClass: object;
    readonly week: string;
    readonly weeks: string;
};

export function formatDate(date: Date = new Date() ): IFormatedDate {
    
    const formated: any = {};
    
    formated.__dateClass = date;
    formated.sec = Math.floor(date.getTime() / 1000);
    formated.ms = date.getTime();
    formated.date = `${date.getDate().toString().padStart(2, '0')}.` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
        `${date.getFullYear()}`;
    formated.time = `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`;
    formated.full = formated.date + ' ' + formated.time;
    formated.weeks = [
        ["sunday","воскресенье"],
        ["monday","понедельник"],
        ["tuesday","вторник"],
        ["wednesday","среда"],
        ["thursday","четверг"],
        ["friday","пятница"],
        ["saturday","суббота"],
    ];
    formated.week = formated.weeks[date.getDay()];

    return formated;

};

export const shine_build = {
    createdAt: shine_build_raw.birthtimeMs,
    builded: shine_build_raw.mtimeMs
};
export const preshine = `${shine_emoji} шайни`;
export const itsMe = (ctx: MessageContext, me: number) => ctx.isOutbox || ctx.peerId === me;