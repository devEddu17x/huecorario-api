import { registerAs } from '@nestjs/config';

export default registerAs('cloudflare', () => {
  const {
    ACCOUNT_ID,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    BUCKET_NAME,
    BASE_URL,
  } = process.env;
  return {
    accountId: ACCOUNT_ID,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    bucket: BUCKET_NAME,
    url: BASE_URL,
  };
});
