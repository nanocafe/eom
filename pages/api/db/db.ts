
import { Sequelize } from 'sequelize';

const DB = new Sequelize(process.env.POSTGRES_DB_URL || '', {dialect: 'postgres'});

export default DB;