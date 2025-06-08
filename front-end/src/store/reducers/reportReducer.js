import {
  GET_REPORTS,
  GET_REPORT,
  GENERATE_REPORT,
  REPORT_ERROR,
  REPORT_LOADING
} from '../types';

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: null
};

 function reportReducer (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REPORT_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_REPORTS:
      return {
        ...state,
        reports: payload,
        loading: false,
        error: null
      };
    case GET_REPORT:
      return {
        ...state,
        report: payload,
        loading: false,
        error: null
      };
    case GENERATE_REPORT:
      return {
        ...state,
        reports: [payload, ...state.reports],
        report: payload,
        loading: false,
        error: null
      };
    case REPORT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}

export default reportReducer;