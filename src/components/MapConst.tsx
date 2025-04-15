import { Fazer } from "../App";

export const YMapsModul = [
  "multiRouter.MultiRoute",
  "Polyline",
  "templateLayoutFactory",
  "Circle",
];

export const MyYandexKey = "65162f5f-2d15-41d1-a881-6c1acf34cfa1"; // ключ

export const NoClose = "Этот светофор без предварительного закрытия предыдущего светофора закрывать нельзя"

export const zoomStart = 12; // начальный zoom Yandex-карты

export const MaskFaz: Fazer = {
  idx: 0,
  area: 0,
  id: 0,
  coordinates: [],
  faza: 0,
  fazaBegin: 0,
  fazaSist: -1,
  fazaSistOld: -1,
  phases: [],
  idevice: 0,
  name: "",
  starRec: false,
  runRec: 0, // 0-начало 1-финиш 2-актив 3-хз 4-активДемо 5-финишДемо
  img: [],
};

export const CLINCH: Array<number> = [
  // список аварийных кодов
  3, // Перекресток работает в Ручном режиме
  8, // Ручное управление ЖМ
  13, // Светофор отключен в ручном режиме
  16, // Авария 220В
  17, // Выключен УСДК
  18, // Нет связи с УСДК
  19, // Нет связи с ПСПД
  20, // Обрыв линии связи
  22, // Базовая привязка
  24, // Коррекция привязки
  28, // Обрыв линии связи
  29, // Негоден по паритету
  30, // ОС конфликт
  32, // ЖМ по перегоранию
  //35, // Не подчинение командам
  38, // Нет информации
];

export const BadCODE: Array<number> = [
  // список "плохих" кодов
  25, // Несуществующая фаза
  35, // Не подчинение командам
];