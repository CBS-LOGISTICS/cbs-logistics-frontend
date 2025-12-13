import { getCookie, getCookies } from 'cookies-next';
import { Constants } from './enums';

export const getPreloadedState = () => {
  const token = getCookie(Constants.TOKEN);
  console.log(getCookies(), "TOKEN VALUE");

  const defalutValue = {
    auth: {
      access_token: (token ? token : null) as string | null,
    },
  };
  return defalutValue;
};
