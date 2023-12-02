import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartItems from '../../cartItems'
import axios from 'axios'

const url = 'https://course-api.com/react-useReducer-cart-project'

export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, ThunkAPI) => {
    try {
        const resp = await axios(url)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        return ThunkAPI.rejectWithValue('Somethin went Wrong...')
    }
})

const initialState = {
    cartItems: cartItems,
    amount: 4,
    total: 0,
    isLoading: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = []
        },
        removeItem: (state, action) => {
            const ItemId = action.payload
            state.cartItems = state.cartItems.filter((item) => item.id !== ItemId);
        },
        increaseItem: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            cartItem.amount = cartItem.amount + 1
        },
        decreaseItem: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.id === payload.id);
            cartItem.amount = cartItem.amount - 1
        },
        calculateTotal: (state) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount
                total += item.amount * item.price
            });
            state.amount = amount;
            state.total = total;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload
            })
            .addCase(getCartItems.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { clearCart, removeItem, increaseItem, decreaseItem, calculateTotal } = cartSlice.actions
export default cartSlice.reducer