import {
  MAP_CREATE,
  MASSDK_CREATE,
  MASSMODE_CREATE,
  STATSAVE_CREATE,
  MASSFAZ_CREATE,
  COORDINATES_CREATE,
} from './types';

import { DateMAP } from './../interfaceMAP.d';
import { Pointer } from './../App';
import { Fazer } from './../App';
import { Stater } from './../App';
import { NameMode } from './../App';

export function massdkCreate(massDka: Pointer[] = []) {
  return {
    type: MASSDK_CREATE,
    data: massDka,
  };
}

export function massfazCreate(massFaza: Fazer[] = []) {
  //console.log('action_massfazReducer:', massFaza);
  return {
    type: MASSFAZ_CREATE,
    data: massFaza,
  };
}

export function massmodeCreate(massMod: NameMode[] = []) {
  return {
    type: MASSMODE_CREATE,
    data: massMod,
  };
}

export function mapCreate(dateMap: DateMAP) {
  return {
    type: MAP_CREATE,
    data: { dateMap },
  };
}

export function statsaveCreate(dateStat: Stater) {
  return {
    type: STATSAVE_CREATE,
    data: dateStat,
  };
}

export function coordinatesCreate(Coordinates: Array<Array<number>>) {
  return {
    type: COORDINATES_CREATE,
    data: Coordinates,
  };
}
