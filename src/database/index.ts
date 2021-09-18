
import { Sequelize } from 'sequelize';
import VoiceModel from '@model-voice';
import settings from '@shine-json';

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: settings.database.storage,
    logging: false
});

async function init() {
    
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

};

export default { init };