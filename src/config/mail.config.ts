import {registerAs} from '@nestjs/config';

export default registerAs('mail', () => {
  const {API_KEY, MAIL_FROM} = process.env;
  return {
    apiKey: API_KEY,
    from: MAIL_FROM,
  };
});
