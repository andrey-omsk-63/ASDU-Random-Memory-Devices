import { BINDINGS_CREATE } from './types';

import { dateBindingsGl } from './../App';

const intialState = {
  bindings: dateBindingsGl,
};

export const bindingsReducer = (state = intialState, action: any) => {
  //console.log('bindingsReducer:', action);
  switch (action.type) {
    case BINDINGS_CREATE:
      return {
        ...state,
        bindings: action.data,
      };

    default:
      return state;
  }
};
