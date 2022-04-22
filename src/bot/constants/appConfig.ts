import { LanguageEnum } from '../enums/LanguageEnum';

type TAppConfig = {
  release: boolean;
  isOpen: boolean;
  language: LanguageEnum;
};

const appConfig: TAppConfig = {
  release: false,
  isOpen: true,
  language: LanguageEnum['pt-BR'],
};

export default appConfig;
