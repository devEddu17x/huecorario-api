import {registerAs} from '@nestjs/config';

export default registerAs('cache', () => {
  const {URL, TOKEN} = process.env;
  return {
    url: URL,
    token: TOKEN,
  };
});
