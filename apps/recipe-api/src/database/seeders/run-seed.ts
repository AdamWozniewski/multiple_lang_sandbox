import dataSource from '../../config/data-source';
import { seed } from './seeds/0-userSeeder';

dataSource.initialize()
  .then((ds) => seed(ds))
  .then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });