import { IPosition } from 'inversihax';

type TTouchInfo = {
  toucherIds: number[];
  ballPosition: IPosition;
  hasKick: boolean;
};

export default TTouchInfo;
