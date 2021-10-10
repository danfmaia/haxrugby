import TConversionProps from '../stadium/TConversionProps';

type THaxRugbyStadiums = {
  getKickoff: (kickoffX?: number) => string;
  getConversion: (conversionProps: TConversionProps) => string;
};

export default THaxRugbyStadiums;
