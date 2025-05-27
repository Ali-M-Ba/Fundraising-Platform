import mongoose from "mongoose";
import User from "../models/User.model.js";
import Orphanage from "../models/Orphanage.model.js";
import Orphan from "../models/Orphan.model.js";
import Campaign from "../models/Campaign.model.js";

const { Types } = mongoose;

const users = [
  {
    _id: new Types.ObjectId("664a1e100000000000000001"),
    fullName: "Admin User",
    email: "admin@example.com",
    password: "AdminPass123", // hash before saving
    role: "admin",
    phone: "+12345678901",
    address: {
      street: "123 Admin Street",
      city: "Admin City",
      country: "Adminland",
    },
    cart: [],
  },
  {
    _id: new Types.ObjectId("664a1e100000000000000002"),
    fullName: "Donor User",
    email: "donor@example.com",
    password: "DonorPass123", // hash before saving
    role: "donor",
    phone: "+19876543210",
    address: {
      street: "456 Donor Ave",
      city: "Donorville",
      country: "Donoria",
    },
    cart: [],
  },
  {
    _id: new Types.ObjectId("664a1e100000000000000003"),
    fullName: "Orphanage One",
    email: "orphanage1@example.com",
    password: "OrphanPass123", // hash before saving
    role: "orphanage",
    phone: "+11223344556",
    address: {
      street: "789 Orphan Road",
      city: "Hope City",
      country: "Careland",
    },
    cart: [],
  },
  {
    _id: new Types.ObjectId("664a1e100000000000000004"),
    fullName: "Orphanage Two",
    email: "orphanage2@example.com",
    password: "OrphanPass123", // hash before saving
    role: "orphanage",
    phone: "+12233445566",
    address: {
      street: "101 Help St",
      city: "Support Town",
      country: "Kindom",
    },
    cart: [],
  },
  {
    _id: new Types.ObjectId("664a1e100000000000000005"),
    fullName: "Orphanage Three",
    email: "orphanage3@example.com",
    password: "OrphanPass123", // hash before saving
    role: "orphanage",
    phone: "+13344556677",
    address: {
      street: "202 Shelter Lane",
      city: "Charity City",
      country: "Peace Nation",
    },
    cart: [],
  },
];

const orphanages = [
  {
    _id: new Types.ObjectId("664a1f000000000000000001"),
    name: "Hope Haven Orphanage",
    adminId: new Types.ObjectId("664a1e100000000000000003"), // Orphanage One
    location: {
      city: "Hope City",
      country: "Careland",
    },
    contact: {
      email: "contact@hopehaven.org",
      phone: "+11223344556",
    },
    description:
      "Hope Haven provides shelter, food, and education for over 100 children in Careland.",
    images: [
      "https://media.istockphoto.com/id/1285387549/vector/palm-of-child-in-adult-solid-icon-kids-protection-concept-helping-hand-sign-on-white.jpg?s=612x612&w=0&k=20&c=bbvaqAs7jqGXdaqsZBqCIrdBKzPf8ReqKqtpsC9gUrg=",
    ],
  },
  {
    _id: new Types.ObjectId("664a1f000000000000000002"),
    name: "Kind Heart Orphanage",
    adminId: new Types.ObjectId("664a1e100000000000000004"), // Orphanage Two
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    contact: {
      email: "info@kindheart.org",
      phone: "+12233445566",
    },
    description:
      "A safe place for children who have lost their families, focusing on health and education.",
    images: [
      "https://media.istockphoto.com/id/1185263746/vector/love-yourself-heart-hug.jpg?s=612x612&w=0&k=20&c=yJNCx0_e3KAjvRVniEYy2vP8j32j5Ivnm7L6J82FjvU=",
    ],
  },
  {
    _id: new Types.ObjectId("664a1f000000000000000003"),
    name: "Bright Future Home",
    adminId: new Types.ObjectId("664a1e100000000000000005"), // Orphanage Three
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    contact: {
      email: "brightfuture@home.org",
      phone: "+13344556677",
    },
    description:
      "Bright Future Home empowers orphans with skills and education for a better tomorrow.",
    images: [
      "https://media.istockphoto.com/id/2214026680/vector/vector-logo-with-hands-holding-heart-inside-house-shape.jpg?s=612x612&w=0&k=20&c=_Lx0SjIcs5XrXIJggP7D_Hq-vL_UBoaFUnJHfvfYWzU=",
    ],
  },
];

const orphans = [
  // Hope Haven Orphanage
  {
    _id: new Types.ObjectId("664a2a000000000000000001"),
    name: "Amina Yusuf",
    nationalNumber: 100001,
    age: 10,
    gender: "Female",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    location: {
      city: "Hope City",
      country: "Careland",
    },
    needs: [
      { category: "School Supplies", amountNeeded: 150 },
      { category: "Clothing", amountNeeded: 100 },
    ],
    isSponsored: false,
    bio: "Amina is an energetic and curious girl who loves reading and drawing.",
    photos: [
      "https://images.pexels.com/photos/5859315/pexels-photo-5859315.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000002"),
    name: "Mohamed Ali",
    nationalNumber: 100002,
    age: 12,
    gender: "Male",
    healthStatus: "Minor Health Issues",
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    location: {
      city: "Hope City",
      country: "Careland",
    },
    needs: [{ category: "Medical Support", amountNeeded: 200 }],
    isSponsored: false,
    bio: "Mohamed enjoys solving puzzles and wants to become a doctor.",
    photos: [
      "https://img.freepik.com/premium-photo/rear-view-man-standing-beach-sunset_1048944-13636271.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000003"),
    name: "Layla Hassan",
    nationalNumber: 100003,
    age: 9,
    gender: "Female",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    location: {
      city: "Hope City",
      country: "Careland",
    },
    needs: [{ category: "Food", amountNeeded: 120 }],
    isSponsored: true,
    bio: "Layla loves animals and dreams of being a veterinarian.",
    photos: [
      "https://images.pexels.com/photos/7911353/pexels-photo-7911353.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },

  // Kind Heart Orphanage
  {
    _id: new Types.ObjectId("664a2a000000000000000004"),
    name: "Yusuf Kareem",
    nationalNumber: 100004,
    age: 11,
    gender: "Male",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    needs: [{ category: "Books", amountNeeded: 80 }],
    isSponsored: false,
    bio: "Yusuf is a bright student and loves mathematics.",
    photos: [
      "https://img.freepik.com/premium-photo/rear-view-boy-standing-beach_1048944-28475495.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000005"),
    name: "Fatima Noor",
    nationalNumber: 100005,
    age: 13,
    gender: "Female",
    healthStatus: "Disabled",
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    needs: [{ category: "Mobility Equipment", amountNeeded: 500 }],
    isSponsored: false,
    bio: "Fatima is a strong and kind girl who enjoys storytelling.",
    photos: [
      "https://img.freepik.com/premium-photo/rear-view-girl-standing-field-against-clear-sky_1048944-8909359.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000006"),
    name: "Ibrahim Nasser",
    nationalNumber: 100006,
    age: 8,
    gender: "Male",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    needs: [{ category: "Nutrition", amountNeeded: 100 }],
    isSponsored: false,
    bio: "Ibrahim loves playing soccer and building with blocks.",
    photos: [
      "https://img.freepik.com/premium-photo/rear-view-boy-standing-retaining-wall-against-sky_1048944-23065938.jpg?semt=ais_items_boosted&w=740",
    ],
  },

  // Bright Future Home
  {
    _id: new Types.ObjectId("664a2a000000000000000007"),
    name: "Salma Zain",
    nationalNumber: 100007,
    age: 7,
    gender: "Female",
    healthStatus: "Minor Health Issues",
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    needs: [{ category: "Health Care", amountNeeded: 300 }],
    isSponsored: false,
    bio: "Salma is a joyful girl who loves singing and painting.",
    photos: [
      "https://images.pexels.com/photos/6156880/pexels-photo-6156880.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000008"),
    name: "Omar Said",
    nationalNumber: 100008,
    age: 10,
    gender: "Male",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    needs: [{ category: "Sports Equipment", amountNeeded: 70 }],
    isSponsored: true,
    bio: "Omar enjoys running and wants to be an athlete.",
    photos: [
      "https://images.pexels.com/photos/3932692/pexels-photo-3932692.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
  {
    _id: new Types.ObjectId("664a2a000000000000000009"),
    name: "Huda Salem",
    nationalNumber: 100009,
    age: 6,
    gender: "Female",
    healthStatus: "Healthy",
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    needs: [{ category: "Toys", amountNeeded: 50 }],
    isSponsored: false,
    bio: "Huda loves to dance and play pretend games.",
    photos: [
      "https://images.pexels.com/photos/6437635/pexels-photo-6437635.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
  },
];

const campaigns = [
  // Hope Haven Orphanage
  {
    _id: new Types.ObjectId("664a30000000000000000001"),
    title: "Back to School Drive",
    description: "Help provide school supplies and uniforms for our orphans.",
    Beneficiaries: 25,
    location: {
      city: "Hope City",
      country: "Careland",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    targetAmount: 2000,
    amountRaised: 500,
    status: "active",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-06-30"),
    images: [
      "https://img.freepik.com/free-photo/back-view-kid-going-school_23-2149748245.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000002"),
    title: "Winter Warmth Campaign",
    description: "Raising funds for coats, blankets, and heaters.",
    Beneficiaries: 20,
    location: {
      city: "Hope City",
      country: "Careland",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    targetAmount: 3000,
    amountRaised: 1200,
    status: "active",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-12-15"),
    images: [
      "https://img.freepik.com/free-photo/homemade-still-life-with-knitted-sweaters-cup-tea-blurred-background_169016-13698.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000003"),
    title: "Health & Hygiene",
    description:
      "Support the health needs of the children through regular checkups and supplies.",
    Beneficiaries: 30,
    location: {
      city: "Hope City",
      country: "Careland",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000001"),
    targetAmount: 2500,
    amountRaised: 2500,
    status: "completed",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-04-01"),
    images: [
      "https://img.freepik.com/free-photo/little-girl-putting-book-her-head-t-shirt-gloves-mask-front-view_176474-8649.jpg?semt=ais_items_boosted&w=740",
    ],
  },

  // Kind Heart Orphanage
  {
    _id: new Types.ObjectId("664a30000000000000000004"),
    title: "Classroom Renovation",
    description: "Help us rebuild a safe and modern classroom space.",
    Beneficiaries: 35,
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    targetAmount: 4000,
    amountRaised: 1600,
    status: "active",
    startDate: new Date("2025-05-10"),
    endDate: new Date("2025-07-10"),
    images: [
      "https://img.freepik.com/premium-photo/interior-abandoned-building_1048944-20890219.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000005"),
    title: "Nutrition Boost",
    description:
      "Fund a 3-month nutrition program for undernourished children.",
    Beneficiaries: 18,
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    targetAmount: 1800,
    amountRaised: 1800,
    status: "completed",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-04-15"),
    images: [
      "https://img.freepik.com/free-photo/medium-shot-brothers-with-food-home_23-2150327592.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000006"),
    title: "Toy & Game Fundraiser",
    description: "Bring joy to our kids with new toys and learning games.",
    Beneficiaries: 22,
    location: {
      city: "Support Town",
      country: "Kindom",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000002"),
    targetAmount: 1000,
    amountRaised: 300,
    status: "active",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-07-01"),
    images: [
      "https://img.freepik.com/premium-photo/childs-toy-box-filled-with-various-toys_561855-87078.jpg?semt=ais_items_boosted&w=740",
    ],
  },

  // Bright Future Home
  {
    _id: new Types.ObjectId("664a30000000000000000007"),
    title: "New Beds for Kids",
    description:
      "We aim to replace old beds and mattresses for better sleep and health.",
    Beneficiaries: 28,
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    targetAmount: 3500,
    amountRaised: 2000,
    status: "active",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-06-15"),
    images: [
      "https://img.freepik.com/premium-photo/two-kids-girls-pajamas-having-pillow-fight-bed-modern-bright-apartment_203451-2036.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000008"),
    title: "Daily Essentials Drive",
    description:
      "Support monthly needs like diapers, soap, toothpaste, and more.",
    Beneficiaries: 30,
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    targetAmount: 1500,
    amountRaised: 500,
    status: "active",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-05-01"),
    images: [
      "https://img.freepik.com/free-photo/delicious-snack-school-time_23-2147654454.jpg?semt=ais_items_boosted&w=740",
    ],
  },
  {
    _id: new Types.ObjectId("664a30000000000000000009"),
    title: "Children's Festival",
    description:
      "Organizing a day of fun, creativity, and gifts for the orphans.",
    Beneficiaries: 40,
    location: {
      city: "Charity City",
      country: "Peace Nation",
    },
    orphanageId: new Types.ObjectId("664a1f000000000000000003"),
    targetAmount: 2200,
    amountRaised: 1000,
    status: "active",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-31"),
    images: [
      "https://img.freepik.com/premium-photo/boy-is-holding-gift-with-little-boy-holding-gift_1064589-76175.jpg?semt=ais_items_boosted&w=740",
    ],
  },
];

export async function seedDatabase() {
  try {
    console.log("🔄 Clearing existing data...");

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Orphanage.deleteMany({}),
      Orphan.deleteMany({}),
      Campaign.deleteMany({}),
    ]);

    console.log("📥 Inserting new data...");

    // Insert new data
    await User.insertMany(users);
    await Orphanage.insertMany(orphanages);
    await Orphan.insertMany(orphans);
    await Campaign.insertMany(campaigns);

    console.log("✅ Database seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
