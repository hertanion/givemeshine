
import { API, MessageContext, PhotoAttachment, VK } from 'vk-io';
import fetch from 'node-fetch';
import chalk from 'chalk';
import consola from 'consola';
import canvas from 'canvas';

import Database from '@shine-database';
import ShineSettings from '@shine-settings';
import { ShineConnectCommands } from '@shine-commands';
import { itsMe, __projname } from '@shine-utils';

async function main() {

    await Database.init();

    const account = new VK({ token: await ShineSettings.get('/account/token/full_access') });
    const vk_me_api = new API({ token: await ShineSettings.get('/account/token/vk_me') });

    const currentUserId = await account.api.account.getProfileInfo({}).then( res => res.id );

    account.updates.on('message_new', async function (ctx, next) {
        if (!itsMe(ctx, currentUserId)) return;
        consola.info("шайни принял мое сообщение!!!!")
        next();
    });
    account.updates.on('message_new', ShineConnectCommands(await ShineSettings.get('/bot/prefix'), await ShineSettings.get('/bot/prefix_as_name')).middleware);

    await account.updates.startPolling();
    consola.ready("шайни успешно запущен")
};
main()