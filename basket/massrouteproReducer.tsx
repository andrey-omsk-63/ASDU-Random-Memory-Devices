import { MASSROUTEPRO_CREATE } from './types';
import { massRoutePro } from './../App';

const intialState = {
  massroutepro: massRoutePro,
};

export const massrouteproReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case MASSROUTEPRO_CREATE:
      return {
        ...state,
        massroutepro: action.data,
      };

    default:
      return state;
  }
};
