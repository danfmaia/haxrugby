import { Role } from 'inversihax';

export class HaxRugbyRole extends Role {
  public static readonly Player = new HaxRugbyRole(1, 'player', 10);
  public static readonly Admin = new HaxRugbyRole(2, 'admin', 50);
  public static readonly SuperAdmin = new HaxRugbyRole(3, 'super-admin', 90);
  public static readonly Owner = new HaxRugbyRole(4, 'owner', 100);

  public readonly weight: number;

  private constructor(id: number, name: string, weight: number) {
    super(id, name);
    this.weight = weight;
  }
}
