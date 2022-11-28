import { MASSMODE_CREATE } from './types';
import { massMode } from './../App';

const intialState = {
  massmode: massMode,
};

export const massmodeReducer = (state = intialState, action: any) => {
  //console.log('massmodeReducer:', action.type, state);
  switch (action.type) {
    case MASSMODE_CREATE:
      return {
        ...state,
        massmode: action.data,
      };

    default:
      return state;
  }
};
