import { combineReducers } from 'redux';
import { massdkReducer } from './massdkReducer';
import { massfazReducer } from './massfazReducer';
import { massmodeReducer } from './massmodeReducer';
import { statsaveReducer } from './statsaveReducer';
import { mapReducer } from './mapReducer';
import { coordinatesReducer } from './coordinatesReducer';

export const rootReducer = combineReducers({
  mapReducer,
  massdkReducer,
  massfazReducer,
  massmodeReducer,
  statsaveReducer,
  coordinatesReducer,
});
