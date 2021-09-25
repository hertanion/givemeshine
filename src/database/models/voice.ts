
import Sequelize, { Model } from "sequelize";
import { sequelize } from "@shine-database";

class Voice extends Model {

    public id!: number;
    public name!: string;
    public data!: string;

    static async find(name: string | undefined) {
        if ( !name ) return false;
        return this.findOne({
            where: {
                name
            }
        });
    };
    static async add(name: string, data: string) {
        const voice = await this.findOne({
            where: {
                name
            }
        });
        if (voice !== null) return false;
        const newvoice = await this.create({
            name,
            data
        });
        return newvoice;
    };
    static async remove(name: string) {
        const voice = await this.findOne({
            where: {
                name
            }
        });
        if (voice === null) return false;
        await this.destroy({
            where: {
                name
            }
        });
        return true;
    };

};

Voice.init({
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    data: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    modelName: 'voices',
    sequelize,
    timestamps: true
});

export default Voice;