import { configureStore } from '@reduxjs/toolkit'
import rootReducers from './Reducers/Index'

const saveToLocalStorage = (data) => {
  const state = JSON.stringify(data)
  localStorage.setItem('state', state)
}


const loadFromLocalStorage = () => {
  try {
    const state = localStorage.getItem('state');
    if (state === null) return undefined;
    return JSON.parse(state);

  } catch (e) {
    console.log(e)
    return undefined;
  }
}
const persistedState = loadFromLocalStorage();

const store = configureStore({
  persistedState,
  reducer: rootReducers,

})

store.subscribe(() => saveToLocalStorage(store.getState()));
export default store;
