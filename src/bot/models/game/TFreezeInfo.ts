import { IDiscPropertiesObject } from 'inversihax';
import { TPlayerPropsMap } from '../player/TPlayerPropsMap';

type TFreezeInfo = {
  ballProps: IDiscPropertiesObject;
  playerPropsMaps: TPlayerPropsMap[];
};

export default TFreezeInfo;
