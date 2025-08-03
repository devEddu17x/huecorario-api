import { registerAs } from '@nestjs/config';

export default registerAs('signature', () => {
  const { HMAC_SECRET } = process.env;
  return {
    secret: HMAC_SECRET,
  };
});
