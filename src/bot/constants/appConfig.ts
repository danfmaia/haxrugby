import { LanguageEnum } from '../enums/stadium/LanguageEnum';

type TAppConfig = {
  isOpen: boolean;
  language: LanguageEnum;
};

const appConfig: TAppConfig = {
  isOpen: true,
  language: LanguageEnum['pt-BR'],
};

export default appConfig;
