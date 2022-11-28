export interface Welcome10 {
  type: string;
  data: Data;
}

// export interface Data {
export interface DateMAP {
  areaInfo: AreaInfo;
  areaZone: AreaZone[];
  authorizedFlag: boolean;
  boxPoint: Box;
  fragments: null;
  license: string;
  regionInfo: RegionInfo;
  routes: Route[];
  tflight: Tflight[];
}

export interface AreaInfo {
  Мосавтодор: { [key: string]: Мосавтодор };
}

export enum Мосавтодор {
  ВтораяПоловина = "Вторая половина",
  ПерваяПоловина = "Первая половина",
  ТретийКусок = "Третий кусок",
}

export interface AreaZone {
  region: The1;
  area: Мосавтодор;
  zone: Point0[];
  sub: Sub[];
}

export enum The1 {
  Мосавтодор = "Мосавтодор",
}

export interface Sub {
  subArea: number;
  zone: Point0[];
}

export interface Point0 {
  Y: number;
  X: number;
}

export interface Box {
  point0: Point0;
  point1: Point0;
}

export interface RegionInfo {
  "1": The1;
}

export interface Route {
  region: string;
  description: string;
  box: Box;
  listTL: ListTL[];
}

export interface ListTL {
  num: number;
  phase: number;
  description: string;
  point: Point0;
  pos: Pos;
}

export interface Pos {
  region: string;
  area: string;
  id: number;
}

export interface Tflight {
  ID: number;
  region: Region;
  area: Area;
  subarea: number;
  idevice: number;
  tlsost: Tlsost;
  description: string;
  phases: number[];
  points: Point0;
  inputError: boolean;
}

export interface Area {
  num: string;
  nameArea: Мосавтодор;
}

export interface Region {
  num: string;
  nameRegion: The1;
}

export interface Tlsost {
  num: number;
  description: Description;
  control: boolean;
}

export enum Description {
  КоординированноеУправление = "Координированное управление",
  НетСвязиСУСДКДК = "Нет связи с УСДК/ДК",
  РУОСОтключениеСветофораЗаданноеНаПерекрестке = "РУ ОС - отключение светофора заданное на перекрестке",
}
