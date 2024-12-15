import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import createMemoryStorage from "redux-persist/lib/storage/createWebStorage";

import themeReducer from "./slices/theme.slice";
import playerReducer from "./slices/player.slice";
import userReducer from "./slices/user.slice";

const isPrivateMode = async () => {
  try {
    await localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return false;
  } catch (e) {
    return true;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  player: playerReducer,
  theme: themeReducer,
  // ... other reducers
});

const initializeStore = async () => {
  const inPrivateMode = await isPrivateMode();

  const persistConfig = {
    key: "root",
    storage: inPrivateMode ? createMemoryStorage() : storage,
    blacklist: ["player","user"],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

export default initializeStore;
