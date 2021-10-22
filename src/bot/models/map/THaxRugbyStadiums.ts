import { IPosition } from 'inversihax';
import TConversionProps from '../stadium/TConversionProps';

type THaxRugbyStadiums = {
  getKickoff: (tickCount: number, matchDuration: number, kickoffPosition?: IPosition) => string;
  getConversion: (
    tickCount: number,
    matchDuration: number,
    conversionProps: TConversionProps,
  ) => string;
  getPenaltyKick: (
    tickCount: number,
    matchDuration: number,
    kickoffPosition: IPosition,
    isPenalty: boolean,
  ) => string;
};

export default THaxRugbyStadiums;
