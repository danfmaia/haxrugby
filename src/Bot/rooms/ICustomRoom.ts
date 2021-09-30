import { IRoom } from 'inversihax';
import { CustomPlayer } from '../models/player/CustomPlayer';

export interface ICustomRoom extends IRoom<CustomPlayer> {
  isGameInProgress: boolean;
}
