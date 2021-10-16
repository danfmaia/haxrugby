import { IPosition } from 'inversihax';
import TConversionProps from '../stadium/TConversionProps';

type THaxRugbyStadiums = {
  getKickoff: (kickoffPosition?: IPosition) => string;
  getConversion: (conversionProps: TConversionProps) => string;
  getPenaltyKick: (kickoffPosition: IPosition, isPenalty: boolean) => string;
};

export default THaxRugbyStadiums;
