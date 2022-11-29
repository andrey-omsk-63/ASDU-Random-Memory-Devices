export interface Welcome8 {
  type: string;
  data: Data;
}

//export interface Data {
export interface DateAddObjects {
  addObjects: AddObject[];
}

export interface AddObject {
  region: number;
  area: number;
  id: number;
  description: string;
  dgis: number[];
}
