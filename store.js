import { configureStore , combineReducers} from "@reduxjs/toolkit";
import AuthReducer from './src/slice/authSlice.js';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage,
  }

const allReducers = combineReducers({
    auth: AuthReducer
})
const persistedReducers = persistReducer(persistConfig,allReducers)

const store =  configureStore({
    reducer: persistedReducers,
    middleware:[thunk]
  })

const persistor = persistStore(store)

export {store, persistor}
