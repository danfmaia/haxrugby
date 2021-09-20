import { IPosition } from 'inversihax';

type TouchInfo = {
  playerId: number;
  touchPosition: IPosition;
  ballPosition: IPosition;
};

export default TouchInfo;
