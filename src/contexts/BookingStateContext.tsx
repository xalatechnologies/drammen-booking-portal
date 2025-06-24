
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { bookingActions } from './booking/actions';
import { bookingStorage } from './booking/storage';

interface BookingState {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  bookingDetails: any;
  step: 'contact' | 'details' | 'confirmation';
}

const initialState: BookingState = {
  contactInfo: {
    name: '',
    email: '',
    phone: ''
  },
  bookingDetails: null,
  step: 'contact'
};

function bookingReducer(state: BookingState, action: any): BookingState {
  switch (action.type) {
    case 'UPDATE_CONTACT_INFO':
      return {
        ...state,
        contactInfo: { ...state.contactInfo, ...action.payload }
      };
    case 'UPDATE_BOOKING_DETAILS':
      return {
        ...state,
        bookingDetails: action.payload
      };
    case 'CLEAR_BOOKING':
      return initialState;
    default:
      return state;
  }
}

const BookingStateContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => {}
});

export const BookingStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  useEffect(() => {
    const savedState = bookingStorage.load();
    if (savedState) {
      dispatch({ type: 'RESTORE_STATE', payload: savedState });
    }
  }, []);

  useEffect(() => {
    bookingStorage.save(state);
  }, [state]);

  return (
    <BookingStateContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingStateContext.Provider>
  );
};

export const useBookingState = () => {
  const context = useContext(BookingStateContext);
  if (!context) {
    throw new Error('useBookingState must be used within BookingStateProvider');
  }
  return context;
};
