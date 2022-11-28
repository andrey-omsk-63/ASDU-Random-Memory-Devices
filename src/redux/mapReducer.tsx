import { MAP_CREATE } from './types';

//import { dateRpuGl } from './../App';
import { dateMapGl } from './../App';

const intialState = {
  map: dateMapGl,
};

export const mapReducer = (state = intialState, action: any) => {
  //console.log('mapReducer:', action);
  switch (action.type) {
    case MAP_CREATE:
      return {
        ...state,
        map: action.data,
      };

    default:
      return state;
  }
};
