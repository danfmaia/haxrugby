import { IRoom } from 'inversihax';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';

export interface ICustomRoom extends IRoom<HaxRugbyPlayer> {
  isGameInProgress: boolean;
}
