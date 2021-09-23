interface ITeam {
  name: string;
}

class Team implements ITeam {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export default Team;
