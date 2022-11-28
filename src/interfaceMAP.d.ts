export interface Welcome10 {
  type: string;
  data: Data;
}

// export interface Data {
export interface DateMAP {
  areaInfo:       AreaInfo;
  areaZone:       AreaZone[];
  authorizedFlag: boolean;
  boxPoint:       BoxPoint;
  fragments:      null;
  license:        string;
  regionInfo:     RegionInfo;
  tflight:        Tflight[];
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
  area:   Мосавтодор;
  zone:   Point0[];
  sub:    Sub[];
}

export enum The1 {
  Мосавтодор = "Мосавтодор",
}

export interface Sub {
  subArea: number;
  zone:    Point0[];
}

export interface Point0 {
  Y: number;
  X: number;
}

export interface BoxPoint {
  point0: Point0;
  point1: Point0;
}

export interface RegionInfo {
  "1": The1;
}

export interface Tflight {
  ID:          number;
  region:      Region;
  area:        Area;
  subarea:     number;
  idevice:     number;
  tlsost:      Tlsost;
  description: string;
  phases:      number[];
  points:      Point0;
  inputError:  boolean;
  input:       Input;
}

export interface Area {
  num:      string;
  nameArea: Мосавтодор;
}

export interface Input {
  V1: boolean;
  V2: boolean;
  V3: boolean;
  V4: boolean;
  V5: boolean;
  V6: boolean;
  V7: boolean;
  V8: boolean;
  S:  boolean[];
}

export interface Region {
  num:        string;
  nameRegion: The1;
}

export interface Tlsost {
  num:         number;
  description: Description;
  control:     boolean;
}

export enum Description {
  ВыключенУСДКДК = "Выключен УСДК/ДК",
  ЖелтоеМиганиеИзЗаПерегоранияКонтролируемыхКрасныхЛамп = "Желтое мигание из-за перегорания контролируемых красных ламп",
  КоординированноеУправление = "Координированное управление",
  НетСвязиСУСДКДК = "Нет связи с УСДК/ДК",
  ОбрывЛинийСвязи = "Обрыв линий связи",
}

