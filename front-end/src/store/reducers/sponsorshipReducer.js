import {
  GET_SPONSORSHIPS,
  GET_SPONSORSHIP,
  CREATE_SPONSORSHIP,
  UPDATE_SPONSORSHIP,
  DELETE_SPONSORSHIP,
  SPONSORSHIP_ERROR,
  SPONSORSHIP_LOADING,
  CONFIRM_SPONSORSHIP,
  UPLOAD_PROOF
} from '../types';

const initialState = {
  sponsorships: [],
  sponsorship: null,
  loading: false,
  error: null
};
function sponsorshipReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SPONSORSHIP_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_SPONSORSHIPS:
      return {
        ...state,
        sponsorships: payload,
        loading: false,
        error: null
      };
    case GET_SPONSORSHIP:
      return {
        ...state,
        sponsorship: payload,
        loading: false,
        error: null
      };
    case CREATE_SPONSORSHIP:
      return {
        ...state,
        sponsorships: [payload, ...state.sponsorships],
        loading: false,
        error: null
      };
    case UPDATE_SPONSORSHIP:
    case CONFIRM_SPONSORSHIP:
    case UPLOAD_PROOF:
      return {
        ...state,
        sponsorships: state.sponsorships.map(sponsorship =>
          sponsorship.id === payload.id ? payload : sponsorship
        ),
        sponsorship: payload,
        loading: false,
        error: null
      };
    case DELETE_SPONSORSHIP:
      return {
        ...state,
        sponsorships: state.sponsorships.filter(
          sponsorship => sponsorship.id !== payload
        ),
        loading: false,
        error: null
      };
    case SPONSORSHIP_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}

export default sponsorshipReducer;