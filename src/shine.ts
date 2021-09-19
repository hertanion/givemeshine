
import { API, VK } from 'vk-io';
import consola from 'consola';

import Database from '@shine-database';
import ShineSettings, { account } from '@shine-settings';
import { ShineConnectCommands } from '@shine-commands';
import { itsMe, __projname } from '@shine-utils';

async function main() {

    await Database.init();
    const currentUserId = await account.api.account.getProfileInfo({}).then( res => res.id );

    account.updates.on('message_new', async function (ctx, next) {
        if (!itsMe(ctx, currentUserId)) return;
        await ctx.loadMessagePayload();
        consola.info("шайни принял мое сообщение!!!!");
        next();
    });
    account.updates.on('message_new', ShineConnectCommands(await ShineSettings.get('/bot/prefix'), await ShineSettings.get('/bot/prefix_as_name')).middleware);

    await account.updates.startPolling();
    consola.ready("шайни успешно запущен");

};
main();