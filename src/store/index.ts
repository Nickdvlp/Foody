import { configureStore } from "@reduxjs/toolkit";
import foodReducer from "./food/foodSlice";
import partnerReducer from "./partner/partnerSlice";
import cartReducer from "./cart/cartSlice";

export const store = configureStore({
  reducer: {
    food: foodReducer,
    partner: partnerReducer,
    cart: cartReducer,
  },
});

// Type exports for useSelector + useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
