import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Partner {
  name: string;
  address: string;
  imageUrl: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface PartnerState {
  partner: Partner | null;
}

const initialState: PartnerState = {
  partner: null,
};

export const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    storePartner: (state, action: PayloadAction<Partner>) => {
      state.partner = action.payload;
    },
  },
});

export const { storePartner } = partnerSlice.actions;
export default partnerSlice.reducer;
