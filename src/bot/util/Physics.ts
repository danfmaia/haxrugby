import { IPosition } from 'inversihax';

import { BALL_RADIUS, TOUCH_EPSILON, PLAYER_RADIUS } from '../constants/constants';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import TTouchInfo from '../models/game/TTouchInfo';

function calcDistanceBetweenPositions(p1: IPosition, p2: IPosition): number {
  const d1 = p1.x - p2.x;
  const d2 = p1.y - p2.y;
  return Math.sqrt(d1 * d1 + d2 * d2);
}

// function getTouchPosition(playerPos: IPosition, ballPos: IPosition): IPosition {
//   const position: IPosition = {
//     x: (playerPos.x * BALL_RADIUS + ballPos.x * PLAYER_RADIUS) / (BALL_RADIUS + PLAYER_RADIUS),
//     y: (playerPos.y * BALL_RADIUS + ballPos.y * PLAYER_RADIUS) / (BALL_RADIUS + PLAYER_RADIUS),
//   };
//   return position;
// }

function getTouchTriggerDistance(radius1: number, radius2: number): number {
  return radius1 + radius2 + TOUCH_EPSILON;
}

function getIsTouching(
  triggerDistance: number,
  position1: IPosition,
  position2: IPosition,
): boolean {
  const distance = calcDistanceBetweenPositions(position1, position2);
  return distance < triggerDistance;
}

function getTouchInfoList(
  players: HaxRugbyPlayer[],
  ballPosition: IPosition,
  isAerialBall: boolean,
): TTouchInfo | null {
  if (isAerialBall) {
    return null;
  }

  const toucherIds: number[] = [];
  const triggerDistance = getTouchTriggerDistance(BALL_RADIUS, PLAYER_RADIUS);

  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    // Skip players that don't have a position
    if (player.position === null) continue;

    const isTouching = getIsTouching(triggerDistance, player.position, ballPosition);
    if (isTouching) {
      toucherIds.push(player.id);
    }
  }

  if (toucherIds.length) {
    return {
      toucherIds: toucherIds,
      ballPosition: ballPosition,
      hasKick: false,
    };
  }
  return null;
}

function getToucherIds(touchInfoList: (TTouchInfo | null)[]): number[] {
  if (touchInfoList && touchInfoList.length) {
    const currentTouchInfo = touchInfoList[0];
    if (currentTouchInfo) {
      return currentTouchInfo.toucherIds;
    }
  }
  return [];
}

function getDriverIds(touchInfoList: (TTouchInfo | null)[]): number[] {
  let driverIds: number[] = [];
  let firstTouchInfo: TTouchInfo;

  for (let index = 0; index < touchInfoList.length; index++) {
    const touchInfo = touchInfoList[index];
    // TODO: Improve hasKick logic to only discard kicker's toucherId.
    if (!touchInfo || touchInfo.toucherIds.length === 0 || touchInfo.hasKick) {
      return [];
    }
    if (index === 0) {
      firstTouchInfo = touchInfo;
      // register all potential drivers
      driverIds = [...touchInfo.toucherIds];
    } else {
      touchInfo.toucherIds.forEach((toucherId) => {
        // unregister players that didn't touch the ball in a tick contained in the minimal tick
        //   range for driving (DRIVE_MIN_TICKS)
        if (firstTouchInfo.toucherIds.includes(toucherId) === false) {
          driverIds = driverIds.filter((driverId) => driverId !== toucherId);
        }
      });
    }
  }

  return driverIds;
}

function hasPositionChanged(oldPosition: IPosition, newPosition: IPosition): Boolean {
  const xDif = +(oldPosition.x - newPosition.x).toFixed(1);
  const yDif = +(oldPosition.y - newPosition.y).toFixed(1);
  if (xDif > 0 || yDif > 0) {
    return true;
  }
  return false;
}

// function getTouchPositionAndPlayers(
//   players: CustomPlayer[],
//   ballPosition: IPosition,
// ): ITouchInfo[] {
//   const touchPlayersAndPositions: ITouchInfo[] = [];
//   const triggerDistance = BALL_RADIUS + PLAYER_RADIUS + BALL_TOUCH_EPSILON;

//   for (let i = 0; i < players.length; i++) {
//     const player = players[i];

//     // Skip players that don't have a position
//     if (player.position === null) continue;

//     const distanceToBall = calcDistanceBetweenPositions(player.position, ballPosition);

//     const hadTouchedTheBall = touchPlayersAndPositions.find(
//       (playerAndPosition) => playerAndPosition.playerId === player.id,
//     );

//     // This check is here so that the event is only notified the first game tick in which the player is touching the ball.
//     if (!hadTouchedTheBall) {
//       if (distanceToBall < triggerDistance) {
//         const touchPosition = getTouchPosition(player.position, ballPosition);
//         touchPlayersAndPositions.unshift({
//           playerId: player.id,
//           touchPosition: touchPosition,
//           ballPosition,
//         });
//       }
//     } else {
//       // If a player that had touched the ball moves away from the ball remove him from the set to allow the event to be notified again.
//       if (distanceToBall > triggerDistance + 4) {
//         touchPlayersAndPositions.filter(
//           (playerAndPosition) => playerAndPosition.playerId !== player.id,
//         );
//       }
//     }
//   }

//   return touchPlayersAndPositions;
// }

const Physics = {
  calcDistanceBetweenPositions,
  getTouchTriggerDistance,
  getIsTouching,
  getTouchInfoList,
  getToucherIds,
  getDriverIds,
  hasPositionChanged,
};

export default Physics;
