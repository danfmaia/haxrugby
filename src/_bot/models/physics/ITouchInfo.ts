import { IPosition } from 'inversihax';

type ITouchInfo = {
  toucherIds: number[];
  ballPosition: IPosition;
  hasKick: boolean;
};

export default ITouchInfo;
