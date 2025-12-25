import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Food {
  id: string;
  name: string;
  description: string;
  price: string;
  preparationTime: number;
  imageUrl: string | null;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  restaurantId: string;
  restaurantName: string | null;
}

interface FilterQuery {
  selectedCategories: string[];
  priceRange: number[];
  minRating: number;
  isVeg: boolean;
}

interface FoodState {
  foods: Food[];
  filteredFoods: Food[];
  searchQuery: string;
  loading: boolean;
}

const initialState: FoodState = {
  foods: [],
  filteredFoods: [],
  searchQuery: "",
  loading: false,
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods = action.payload;
      state.filteredFoods = action.payload;
      state.loading = false;
    },
    appendFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods.push(...action.payload);
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      const query = action.payload.toLowerCase();

      state.filteredFoods = state.foods.filter((food) =>
        food.name.toLowerCase().includes(query)
      );
    },

    filteredFood: (state, action: PayloadAction<FilterQuery>) => {
      const { selectedCategories, priceRange, minRating, isVeg } =
        action.payload;

      state.foods = state.foods.filter((food) => {
        const price = Number(food.price);

        const priceMatch = price >= priceRange[0] && price <= priceRange[1];

        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories
            .map((cat) => cat.toLowerCase())
            .includes(food.category.toLowerCase());

        const vegMatch = !isVeg || food.isVeg === true;

        const ratingMatch =
          food.rating === undefined || food.rating >= minRating;

        return priceMatch && categoryMatch && vegMatch && ratingMatch;
      });
    },
  },
});

export const {
  setFoods,
  appendFoods,
  setLoading,
  setSearchQuery,
  filteredFood,
} = foodSlice.actions;
export default foodSlice.reducer;
