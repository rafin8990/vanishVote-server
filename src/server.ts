import mongoose from 'mongoose';
import config from './config/index';
import app from './app';

async function boostrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`🛢 Database is connected successfully`);
    app.listen(config.port, () => {
      console.log(`🚀 Application is listening on port ${config.port}`);
    });

  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1); 
  }
}



boostrap();
