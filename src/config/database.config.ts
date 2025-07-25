import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const { MONGODB_URI, DB_NAME } = process.env;
  return {
    uri: MONGODB_URI,
    dbName: DB_NAME,
  };
});
