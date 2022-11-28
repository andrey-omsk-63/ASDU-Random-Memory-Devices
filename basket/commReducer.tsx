import { COMM_CREATE } from './types';

import { dateRpuGl } from './../App';

const intialState = {
  comm: dateRpuGl,
};

export const commReducer = (state = intialState, action: any) => {
  //console.log('commReducer:', action);
  switch (action.type) {
    case COMM_CREATE:
      return {
        ...state,
        comm: action.data,
      };

    default:
      return state;
  }
};
