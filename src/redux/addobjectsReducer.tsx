import { ADDOBJECTS_CREATE } from './types';

import { dateAddObjectsGl } from './../App';

const intialState = {
  addobjects: dateAddObjectsGl,
};

export const addobjectsReducer = (state = intialState, action: any) => {
  //console.log('addobjectsReducer:', action);
  switch (action.type) {
    case ADDOBJECTS_CREATE:
      return {
        ...state,
        addobjects: action.data,
      };

    default:
      return state;
  }
};
