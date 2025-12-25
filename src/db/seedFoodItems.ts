import "dotenv/config";
import { db } from ".";
import { foodItemsTable } from "./schema";

export const seedFoodItems = async () => {
  const restaurantId = "5dd558aa-1074-469a-9af2-72c8f775fcc9";
  const items = [
    {
      name: "Veg Biryani",
      description: "Fragrant basmati rice cooked with vegetables and spices",
      price: "230.00",
      preparationTime: 25,
      ingredients: ["Rice", "Vegetables", "Spices", "Herbs"],
      imageUrl: "/food/veg-biryani.jpg",
      isAvailable: true,
      category: "Rice",
      isVeg: true,
      rating: "4.4",
      restaurantId,
    },
    {
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in creamy butter gravy",
      price: "210.00",
      preparationTime: 30,
      ingredients: ["Black Lentils", "Butter", "Cream", "Spices"],
      imageUrl: "/food/dal-makhani.jpg",
      isAvailable: true,
      category: "Main Course",
      isVeg: true,
      rating: "4.3",
      restaurantId,
    },
    {
      name: "Chole Bhature",
      description: "Spicy chickpea curry served with fluffy fried bread",
      price: "240.00",
      preparationTime: 20,
      ingredients: ["Chickpeas", "Flour", "Spices", "Onion"],
      imageUrl: "/food/chole-bhature.jpg",
      isAvailable: true,
      category: "North Indian",
      isVeg: true,
      rating: "4.5",
      restaurantId,
    },
    {
      name: "Masala Dosa",
      description: "Crispy dosa filled with spiced potato masala",
      price: "180.00",
      preparationTime: 15,
      ingredients: ["Rice Batter", "Potato", "Spices"],
      imageUrl: "/food/masala-dosa.jpg",
      isAvailable: true,
      category: "South Indian",
      isVeg: true,
      rating: "4.4",
      restaurantId,
    },
    {
      name: "Veg Fried Rice",
      description: "Wok-tossed rice with fresh vegetables and sauces",
      price: "200.00",
      preparationTime: 15,
      ingredients: ["Rice", "Vegetables", "Soy Sauce"],
      imageUrl: "/food/veg-fried-rice.jpg",
      isAvailable: true,
      category: "Chinese",
      isVeg: true,
      rating: "4.2",
      restaurantId,
    },
    {
      name: "Paneer Tikka",
      description: "Grilled paneer cubes marinated with Indian spices",
      price: "260.00",
      preparationTime: 18,
      ingredients: ["Paneer", "Curd", "Spices"],
      imageUrl: "/food/paneer-tikka.jpg",
      isAvailable: true,
      category: "Starters",
      isVeg: true,
      rating: "4.6",
      restaurantId,
    },
    {
      name: "Vegetable Khichdi",
      description: "Comfort food made with rice, lentils, and vegetables",
      price: "170.00",
      preparationTime: 20,
      ingredients: ["Rice", "Lentils", "Vegetables"],
      imageUrl: "/food/veg-khichdi.jpg",
      isAvailable: true,
      category: "Healthy",
      isVeg: true,
      rating: "4.1",
      restaurantId,
    },
    {
      name: "Gulab Jamun",
      description: "Soft milk-solid dumplings soaked in sugar syrup",
      price: "120.00",
      preparationTime: 10,
      ingredients: ["Milk Solids", "Sugar", "Ghee"],
      imageUrl: "/food/gulab-jamun.jpg",
      isAvailable: true,
      category: "Desserts",
      isVeg: true,
      rating: "4.7",
      restaurantId,
    },
  ];

  await db.insert(foodItemsTable).values(items);
};

seedFoodItems()
  .then(() => {
    console.log("✅ Food items seeded successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
