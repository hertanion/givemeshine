
import { SessionManager } from '@vk-io/session'
import consola from 'consola';
import boxen from 'boxen';
import chalk from 'chalk';

import Database from '@shine-database';
import { account, settings } from '@shine-settings';
import { ShineConnectCommands } from '@shine-commands';
import { log, shine_build, __projname, formatDate } from '@shine-utils';

async function main() {

    console.log(boxen(`givemeshine\nvk userbot\nsource: https://github.com/whyrinki/givemeshine\nbuilded: ${formatDate(new Date(shine_build.builded)).full}`, { padding: 1 }));

    const sessions = new SessionManager();
    log(chalk`{rgb(77, 255, 77) [database]}`,"подключение и настройка бд...");
    await Database.init();
    log(chalk`{rgb(77, 255, 77) [database]}`,"готово!");
    log(chalk`{rgb(0, 170, 255) [vk]}`,`входим на страницу ${settings.account.name}...`);
    const AccountOwner = await account.api.account.getProfileInfo({});
    log(chalk`{rgb(0, 170, 255) [vk]}`, chalk`{rgb(0, 170, 255) вошли под} ${AccountOwner.first_name} ${AccountOwner.last_name} {rgb(0, 170, 255) |} {rgb(0, 170, 255) VK ID:} ${AccountOwner.id} {rgb(0, 170, 255) |} {rgb(0, 170, 255) короткое имя:} ${AccountOwner.screen_name}`);

    log(chalk`{rgb(255, 102, 153) [system]}`, 'подключаем сессии и команды...')
    account.updates.on('message_new', sessions.middleware);
    account.updates.on('message_new', ShineConnectCommands(settings.bot.prefix, settings.bot.prefix_as_name, AccountOwner.id).middleware);
    log(chalk`{rgb(255, 102, 153) [system]}`, 'готово!')

    await account.updates.startPolling();
    log(chalk`{rgb(0, 170, 255) [vk]}`,"начал проверять обновления...");

};
main();