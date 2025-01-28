import { Fazer } from "../App";

export const YMapsModul = [
  "multiRouter.MultiRoute",
  "Polyline",
  "templateLayoutFactory",
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