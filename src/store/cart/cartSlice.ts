import { clearCartItems } from "@/modules/cart/server/clear-cart-items";
import removeCartItem from "@/modules/cart/server/remove-cart-item";
import updateCartItem from "@/modules/cart/server/update-cart-item";
import { addToCart } from "@/modules/home/server/add-to-cart";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const addCartItemAsync = createAsyncThunk(
  "cart/addCartItemAsync",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const res = await addToCart({ itemId });
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItemAsync",
  async (itemId: string, { rejectWithValue }) => {
    try {
      await removeCartItem({ itemId });
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartItemAsync = createAsyncThunk(
  "cart/clearCartItemAsync",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartItems();
      return { success: true, message: "Cart cleared successfully." };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItemAsync",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      await updateCartItem({ itemId, quantity });
      return { itemId, quantity };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCartItemAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        const existing = state.items.find(
          (item) => item.itemId === action.meta.arg
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push({
            id: crypto.randomUUID(),
            itemId: action.meta.arg,
            userId: "temp", // or replace with actual userId if available
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      })
      .addCase(addCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.itemId !== action.payload
        );
      })
      .addCase(clearCartItemAsync.fulfilled, (state) => {
        state.items = [];
      })

      // Update quantity
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        const { itemId, quantity } = action.payload;
        const item = state.items.find((i) => i.itemId === itemId);
        if (item) {
          item.quantity = quantity;
          item.updatedAt = new Date().toISOString();
        }
      });
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
