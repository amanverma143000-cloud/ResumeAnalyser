import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  loading: false,
  uploadedResume: null,
  resumeHistory: [],
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalResumes: 0
};

// Action types
export const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_UPLOADED_RESUME: 'SET_UPLOADED_RESUME',
  SET_RESUME_HISTORY: 'SET_RESUME_HISTORY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case actionTypes.SET_UPLOADED_RESUME:
      return {
        ...state,
        uploadedResume: action.payload,
        loading: false,
        error: null
      };
    
    case actionTypes.SET_RESUME_HISTORY:
      return {
        ...state,
        resumeHistory: action.payload,
        loading: false,
        error: null
      };
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case actionTypes.SET_PAGINATION:
      return {
        ...state,
        currentPage: action.payload.page,
        totalPages: action.payload.pages,
        totalResumes: action.payload.total
      };
    
    case actionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;