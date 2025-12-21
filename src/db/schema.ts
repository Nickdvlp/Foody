import { real } from "drizzle-orm/pg-core";
import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const partnerTable = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("owner_name").notNull(),
  userId: text("user_Id")
    .notNull()
    .references(() => usersTable.clerkId, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  address: text("address").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const restaurantTable = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id")
    .notNull()
    .references(() => partnerTable.id, { onDelete: "cascade" }),

  name: text("name").notNull().unique(),
  imageUrl: text("image_url"),
  description: text("description"),
  address: text("address"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const foodItemsTable = pgTable("food-items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  restaurantId: uuid("restaurant_id")
    .$type<string>()
    .notNull()
    .references(() => restaurantTable.id, { onDelete: "cascade" }),

  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  preparationTime: integer("preparation_time").notNull(),
  ingredients: text("ingredients").array(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  category: text("category").notNull(),
  isVeg: boolean("is_veg").default(false),
  rating: numeric("rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cartItemsTable = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.clerkId, { onDelete: "cascade" }),
  itemId: uuid("item_id")
    .notNull()
    .references(() => foodItemsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const addressesTable = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.clerkId, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  lat: real("latitude").notNull(),
  long: real("longitude").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderStatusEnum = pgEnum("order_status_enum", [
  "Placed",
  "Confirmed",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
]);

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.clerkId, { onDelete: "cascade" }),
  addressId: uuid("address_id")
    .notNull()
    .references(() => addressesTable.id, { onDelete: "cascade" }),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurantTable.id, { onDelete: "cascade" }),

  totalAmount: integer("total_amount").notNull(),
  orderStatus: orderStatusEnum("order_status").default("Placed").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("Pending"),
  isSeen: boolean("is_seen").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  foodId: uuid("food_id")
    .notNull()
    .references(() => foodItemsTable.id, { onDelete: "cascade" }),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurantTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export const ratingsReviewsTable = pgTable("ratings_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.clerkId, { onDelete: "cascade" }),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurantTable.id, { onDelete: "cascade" }),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),

  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
