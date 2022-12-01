import { ADDOBJECTS_CREATE } from './types';

import { dateAddObjectsGl } from './../App';

const intialState = {
  addobjects: dateAddObjectsGl,
};

export const addobjectsReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case ADDOBJECTS_CREATE:
      console.log('addobjectsReducer:', action);
      return {
        ...state,
        addobjects: action.data,
      };

    default:
      return state;
  }
};
