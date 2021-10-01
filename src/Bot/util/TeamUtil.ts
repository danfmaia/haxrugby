import TeamEnum from '../enums/TeamEnum';

export function getOpposingTeam(team: TeamEnum): TeamEnum {
  if (team === TeamEnum.RED) {
    return TeamEnum.BLUE;
  }
  return TeamEnum.RED;
}

const TeamUtil = {
  getOpposingTeam,
};

export default TeamUtil;
