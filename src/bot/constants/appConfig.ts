import { LanguageEnum } from '../enums/LanguageEnum';

type TAppConfig = {
  isOpen: boolean;
  language: LanguageEnum;
};

const appConfig: TAppConfig = {
  isOpen: true,
  language: LanguageEnum['pt-BR'],
};

export default appConfig;
