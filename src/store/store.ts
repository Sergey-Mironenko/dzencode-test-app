import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import inventoryReducer from './inventorySlice';
import authReducer from './authSlice';

const persistConfig = {
  key: 'inventory',
  storage,
  blacklist: ['activeSessions'], 
};

const persistedReducer = persistReducer(persistConfig, inventoryReducer);

export const store = configureStore({
  reducer: {
    inventory: persistedReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;