import {
  GET_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  PROFILE_LOADING,
  UPLOAD_PROFILE_IMAGE_SUCCESS,
  UPLOAD_PROFILE_IMAGE_FAIL
} from '../types';

const initialState = {
  profile: null,
  loading: false,
  error: null
};
function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
        error: null
      };
    case UPLOAD_PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          profile_image: payload.profile_image
        },
        loading: false,
        error: null
      };
    case PROFILE_ERROR:
    case UPLOAD_PROFILE_IMAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}

export default profileReducer;