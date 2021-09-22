import { IRoom } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';

export interface ICustomRoom extends IRoom<CustomPlayer> {
  isGameInProgress: boolean;
}
