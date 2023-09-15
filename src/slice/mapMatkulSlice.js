import { createSlice } from "@reduxjs/toolkit";
const mapMatkulSlice = createSlice(
    {
        reducers:{
            updateCurrentActiveMateri: (state, action)=>{
                const {key, value, idMatkul} = action.payload;
                const newSavedData = { ...state.savedData };
                newSavedData[key+"-"+idMatkul] = value; // save id
                state.savedData = newSavedData;

            }

        },
        name:'matkul',
        initialState:{
            savedData: {}
        }
    }
)
export const {updateCurrentActiveMateri} = mapMatkulSlice.actions;
export default mapMatkulSlice.reducer;