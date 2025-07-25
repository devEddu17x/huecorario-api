import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => {
  const { API_KEY, FROM } = process.env;
  return {
    apiKey: API_KEY,
    from: FROM,
  };
});
