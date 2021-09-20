interface ITeam {
  name: string;
}

class Team implements ITeam {
  private _name: string;

  public get name(): string {
    return this._name;
  }

  constructor(name: string) {
    this._name = name;
  }
}

export default Team;
