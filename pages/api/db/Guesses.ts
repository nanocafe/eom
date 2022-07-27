/*

** Define Table 'guesses' CRUD.

Ilustration example: 

+----+-----------+-----------+-------+-----------+
| id | nickname  | address   | price | hash      |
+----+-----------+-----------+-------+-----------+
|  1 | nathan    | nano_1foo | 0.74  | AE4D6F... |
|  2 | joe       | nano_1bar | 2.43  | D9E8BC... |
|  3 | jane      | nano_1baz | 1.80  | F3A5B9... |
+----+-----------+-----------+-------+-----------+

Params:
- id: unique number id for each guess (auto generated)
- nickname: user nickname, cannot repeat.
- address: user Nano address
- hash: payment Nano transaction hash

*/

import { DOUBLE, INTEGER, STRING } from 'sequelize';
import { GuessData } from '../types';
import DB from './db';

export type DataValues = Record<string, unknown>;

class Guesses {

    guesses: any;
    synced: boolean = false;


    constructor() {
        this.guesses = DB.define('guesses', {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            nickname: {
                type: STRING,
                allowNull: false
            },
            address: {
                type: STRING,
                allowNull: false
            },
            price: {
                type: DOUBLE
            },
            hash: {
                type: STRING
            }
        })
        this.sync();
    }

    sync = async () => {
        if (this.synced) return true;
        await DB.sync();
        return true;
    }

    create = async (data: GuessData): Promise<DataValues> => {
        const { dataValues } = await this.guesses.create(data);
        return { dataValues };
    }

    read = async (id: number): Promise<DataValues | null> => {
        const guess = this.guesses.findByPk(id)
        if (!guess) return null;
        return guess.dataValues;
    }

    readAll = async (): Promise<unknown> => {
        return await this.guesses.findAll({ raw: true })
    }

    delete = (id: number) => new Promise((resolve, reject) => {
        this.guesses.destroy({ where: { id } })
            .then(resolve)
            .catch(reject)
    })

    find = async (where: GuessData): Promise<DataValues | null> => {
        const entry = this.guesses.findOne({ where })
        if (!entry) return null;
        return entry.dataValues;
    }
}

let instance: Guesses;

export default {
    sync: () => {
        return instance.sync();
    },
    create: (data: GuessData) => {
        return instance.create(data);
    },
    read: (id: number) => {
        return instance.read(id);
    },
    readAll: () => {
        return instance.readAll();
    },
    delete: (id: number) => {
        return instance.delete(id);
    },
    find: (where: GuessData) => {
        return instance.find(where);
    },
    init: () => {
        if (!instance) {
            instance = new Guesses();
            Object.freeze(instance);
        };
        return instance;
    }
}

