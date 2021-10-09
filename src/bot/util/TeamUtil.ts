import { TeamID } from 'inversihax';
import TeamEnum from '../enums/TeamEnum';

function getOpposingTeam(team: TeamEnum): TeamEnum {
  if (team === TeamEnum.RED) {
    return TeamEnum.BLUE;
  }
  return TeamEnum.RED;
}

function getTeamID(team: TeamEnum): TeamID {
  if (team === TeamEnum.RED) {
    return TeamID.RedTeam;
  }
  return TeamID.BlueTeam;
}

function getOpposingTeamID(team: TeamEnum): TeamID {
  if (team === TeamEnum.RED) {
    return TeamID.BlueTeam;
  }
  return TeamID.RedTeam;
}

const TeamUtil = {
  getOpposingTeam,
  getTeamID,
  getOpposingTeamID,
};

export default TeamUtil;
