import { migrate} from 'drizzle-orm/node-postgres/migrator'
import { db } from './pg';

async function main() {
    console.log('migration started...');
    await migrate(db, { migrationsFolder: 'drizzle'})
    console.log('migration ended...');
    process.exit(0);
}

main().catch(err => {
    console.log(err);
})