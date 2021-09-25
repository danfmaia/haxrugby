import { IPosition } from 'inversihax';

import { BALL_RADIUS, TOUCH_EPSILON, PLAYER_RADIUS } from '../constants/constants';
import { CustomPlayer } from '../models/CustomPlayer';
import ITouchInfo from '../models/physics/ITouchInfo';

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

function getTouchTriggerDistance(radius1: number, radius2: number) {
  return radius1 + radius2 + TOUCH_EPSILON;
}

function getIsTouching(triggerDistance: number, position1: IPosition, position2: IPosition) {
  const distance = calcDistanceBetweenPositions(position1, position2);
  return distance < triggerDistance;
}

function getTouchInfoList(players: CustomPlayer[], ballPosition: IPosition): ITouchInfo | null {
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

type ITouchCount = {
  toucherId: number;
  count: number;
};

function getDriverIds(touchInfoList: (ITouchInfo | null)[]): number[] {
  const driverIds: number[] = [];
  const touchCountList: ITouchCount[] = [];

  touchInfoList.forEach((touchInfo) => {
    if (touchInfo && touchInfo.hasKick === false) {
      touchInfo.toucherIds.forEach((toucherId) => {
        const index = touchCountList.findIndex((touchInfo) => touchInfo.toucherId === toucherId);
        if (index === -1) {
          touchCountList.push({
            toucherId,
            count: 1,
          });
        } else {
          touchCountList[index] = {
            toucherId,
            count: touchCountList[index].count + 1,
          };
        }
      });
    }
  });

  touchCountList.forEach((touchCount) => {
    if (touchCount.count >= 10) {
      driverIds.push(touchCount.toucherId);
    }
  });

  return driverIds;
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
  getDriverIds,
};

export default Physics;
