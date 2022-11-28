// export interface DateMAP {
//   access: { [key: string]: boolean };
//   area: Welcome4Area;
//   areaInfo: AreaInfo;
//   areaZone: AreaZone[];
//   authorizedFlag: boolean;
//   boxPoint: BoxPoint;
//   description: string;
//   fragments: null;
//   license: string;
//   region: string;
//   regionInfo: RegionInfo;
//   role: string;
//   tflight: Tflight[];
// }

// export interface DateMAPArea {
//   '*': string;
// }

// export interface AreaInfo {
//   Мосавтодор: { [key: string]: Мосавтодор };
// }

// export enum Мосавтодор {
//   ВтораяПоловина = 'Вторая половина',
//   ПерваяПоловина = 'Первая половина',
//   ТретийКусок = 'Третий кусок',
// }

// export interface AreaZone {
//   region: The1;
//   area: Мосавтодор;
//   zone: Point0[];
//   sub: Sub[];
// }

// export enum The1 {
//   Мосавтодор = 'Мосавтодор',
// }

// export interface Sub {
//   subArea: number;
//   zone: Point0[];
// }

// export interface Point0 {
//   Y: number;
//   X: number;
// }

// export interface BoxPoint {
//   point0: Point0;
//   point1: Point0;
// }

// export interface RegionInfo {
//   '1': The1;
// }

export interface Tflight {
  ID: number;
  region: Region;
  area: TflightArea;
  subarea: number;
  idevice: number;
  tlsost: Tlsost;
  description: string;
  phases: number[];
  points: Point0;
  inputError: boolean;
}

export interface TflightArea {
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
  КоординированноеУправление = 'Координированное управление',
  НетСвязиСУСДКДК = 'Нет связи с УСДК/ДК',
  РУОСОтключениеСветофораЗаданноеНаПерекрестке = 'РУ ОС - отключение светофора заданное на перекрестке',
}
