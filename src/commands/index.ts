
// block of handlers and etc

// @types
interface MessageRiveContext {
    called: string | false;  
};
interface onMessageCtx<T> {
    onMessage?: (ctx: T, mrctx: MessageRiveContext) => unknown;
};
type AnyProps = { [x: string]: any };
type DefaultProps = { text?: string; hasText: boolean; } & AnyProps;
export interface RiveContext {
    called: string;
    original: string;
    hasText: boolean;
};

type FallbackReturn = unknown;
export type Fallback<T> = (ctx: T) => FallbackReturn;

type MiddlewareReturn = unknown;
export type Middleware<T> = (ctx: T) => MiddlewareReturn; 

export interface Command<T> {
    name: string;
    desc?: string;
    aliases: Array<string>;
    storage?: AnyProps & onMessageCtx<T>;
    handler: (ctx: T, rive_ctx: RiveContext) => unknown;
};

// @functions
const RiveUseName = (name: string) => `${name}\\s+`;

// @classes
export class RiveHandler {
 
    private used_prefix: string;
    private fallback: Function = function() {};
    private commands: any[] = [];

    constructor(public prefix: string, named: boolean = false) {
        this.used_prefix = named === true ? RiveUseName(this.prefix) : this.prefix;
    };

    public registerCommand<T>(commands: Command<T>[]) {
        this.commands.push(...commands);
    };
    public setFallback<T>(handler: Fallback<T>) {
        this.fallback = handler;
    };

    public get middleware() {
        return <T extends DefaultProps>(context: T, ...other: any[]) => {
            
            function createCommandRegExp(prefix: string = '', aliases: Array<string> = []): RegExp {
                return new RegExp(`^${prefix}${aliases.length > 0 ? '(' + aliases.map(e => e.split(/\s+/).join('\\s+')).join('|') + ')' : ''}(?:\\s*|\\s+(.*))$`,'is');
            };

            this.commands.forEach(async(cmd: Command<T>) => {
                cmd?.storage?.onMessage ? cmd?.storage?.onMessage(context, { 
                    called: context.text !== undefined && createCommandRegExp(this.used_prefix, cmd.aliases).test(context.text) ? createCommandRegExp(this.used_prefix, cmd.aliases).exec(context.text)?.[1] || false : false
                 }) : false;
            });

            if (!context.text || context.text === undefined) return false;
            const command: Command<T> | undefined = this.commands.find((command: Command<T>): boolean => createCommandRegExp(this.used_prefix, command.aliases).test(context.text!));
            if (command === undefined) {
                if (createCommandRegExp(this.prefix, ['.+']).test(context.text)) return this.fallback(context);
                return false;
            };

            const matched = createCommandRegExp(this.used_prefix, command.aliases).exec(context.text);
            if(matched === null) throw new TypeError('"matched" is null');
            const rivectx = { called: matched[1], original: context.text, hasText: matched[2] !== undefined ? true : false };
            context.text = matched[2];
            command.handler.bind(command)(context, rivectx);

        };
    };

};

// block of load commands

import ShineCFuck from './fuck';
import ShineCEval from './eval';
import ShineCDemotivator from './demotivator';
import ShineCChance from './chance';
import ShineCWho from './who';
import ShineCVoices from './voices';
import ShineCStealPanties from './steal.panties';
import ShineCRandom from './random';
import ShineCPing from './ping';
import ShineCLullaby from './lullaby';
import ShineCJpeg from './jpeg';
import ShineCHelp from './help';
import { MessageContext } from 'vk-io';
import { preshine } from '@shine-utils';

export const ShineCommands = [
    ShineCRandom,
    ShineCEval,
    ShineCHelp,
    ShineCJpeg,
    ShineCLullaby,
    ShineCPing,
    ShineCStealPanties,
    ShineCVoices,
    ShineCWho,
    ShineCChance,
    ShineCDemotivator,
    ShineCFuck
];

export function ShineConnectCommands(prefix: string, pusname: boolean): RiveHandler {
    
    const commands = new RiveHandler(prefix, pusname);
    commands.registerCommand(ShineCommands);
    commands.setFallback(async (ctx: MessageContext) => ctx.reply(`${preshine}\n\tкоманда не найдена!`));
    return commands;

};