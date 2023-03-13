import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    products: []
};



export const cartSlice = createSlice({
    name: "cart",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
      addToCart: (state, action) => {
        const item = state.products.find(item => item.id === action.payload.id)
        if(item){
            item.quantity+= action.payload.quantity
        }else{
            state.products.push(action.payload)
        }
      },
      removeItem: (state, action) => {
        state.products = state.products.filter(item => item.id !== action.payload)
      },
      // Use the PayloadAction type to declare the contents of `action.payload`
      resetCart: (state) => {
        state.products = []
      },
    },
  })



export const { addToCart, removeItem, resetCart } = cartSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state ) => state.counter.value

export default cartSlice.reducer

