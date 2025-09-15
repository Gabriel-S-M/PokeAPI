export class FavPoke {
  private _id: number;
  private _name: string;
  private _image: string;
  private _types: string[];
  private _abilities: string[];
  private _catchRate: number;
  private _height: number;
  private _weight: number;

  constructor(data: any) {
    this._id = data.id;
    this._name = data.name;
    this._image = data.image;
    this._types = data.types || [];
    this._abilities = data.abilities || [];
    this._catchRate = data.catchRate || 0;
    this._height = data.height || 0;
    this._weight = data.weight || 0;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }

  get types(): string[] {
    return this._types;
  }

  get abilities(): string[] {
    return this._abilities;
  }

  get catchRate(): number {
    return this._catchRate;
  }

  get height(): number {
    return this._height;
  }

  get weight(): number {
    return this._weight;
  }

  set name(value: string) {
    this._name = value;
  }

  set image(value: string) {
    this._image = value;
  }

  set types(value: string[]) {
    this._types = value;
  }

  set abilities(value: string[]) {
    this._abilities = value;
  }

  set catchRate(value: number) {
    this._catchRate = value;
  }

  set height(value: number) {
    this._height = value;
  }

  set weight(value: number) {
    this._weight = value;
  }

  get typesString(): string {
    return this._types.join('/');
  }

  set typesString(value: string) {
    this._types = value.split('/').map(t => t.trim());
  }

  get abilitiesString(): string {
    return this._abilities.join('/ ');
  }

  set abilitiesString(value: string) {
    this._abilities = value.split('/').map(a => a.trim());
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      image: this._image,
      types: this._types,
      abilities: this._abilities,
      catchRate: this._catchRate,
      height: this._height,
      weight: this._weight,
    };
  }
}
