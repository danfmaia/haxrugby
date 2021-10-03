import { Background, Stadium, Trait, Traits, Vertex } from 'inversihax';

class HaxRugbyStadium extends Stadium {
  constructor() {
    super();
  }

  name: string = 'S-HaxRugby v8 R by JP';

  width: number = 420;
  height: number = 200;

  spawnDistance: number = 15;

  bg: Background = {
    type: 'grass',
    width: 390,
    height: 153,
    kickOffRadius: 0,
    cornerRadius: 0,
  };

  traits: Traits = {
    ballArea: {
      vis: true,
      bCoef: 0,
      cGroup: [],
      cMask: [],
    },
  };

  vertexes: Vertex[] = [
    {
      x: -this.width,
      y: this.height,
      trait: 'ballArea',
      bCoef: 0,
      cMask: ['all'],
      cGroup: [''],
    },
  ];
}

export default HaxRugbyStadium;
