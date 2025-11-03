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
}

const initialState: FoodState = {
  foods: [],
  filteredFoods: [],
  searchQuery: "",
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods = action.payload;
      state.filteredFoods = action.payload; // initialize
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

export const { setFoods, setSearchQuery, filteredFood } = foodSlice.actions;
export default foodSlice.reducer;
