import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    reducers:{
        setUser: (state, action) => {
            state.user = {...action.payload}
            
        },
        logoutUser: (state) => {
            state.user = null
        }
    },
    name:'auth',
    initialState:{
        user:null
    }
    
})


export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;