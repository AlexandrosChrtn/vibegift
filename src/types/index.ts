
export interface Product {
  id: number;
  name: string;
  description: string;
  imageName: string; // Will correspond to uploaded image names or placeholders
  ageRange: string[];
  gender: string[];
  occasion: string[];
  interests: string[];
}

export interface GiftFinderSelections {
  ageRange: string | null;
  gender: string | null;
  occasion: string | null;
  interests: string[];
}

export const ageRanges = ["0-5", "6-12", "13-17", "18-25", "26-40", "41-60", "60+"];
export const genders = ["Male", "Female", "Unisex/Other"];
export const occasions = ["Birthday", "Anniversary", "Holiday", "Thank You", "Just Because", "Graduation", "Wedding", "Housewarming"];
export const interestsList = [
  "Tech", "Books", "Travel", "Fashion", "Sports", "Cooking", "Gaming", "Art", "Music", 
  "Outdoors", "Home Decor", "Photography", "Movies", "Fitness", "Gardening", "DIY/Crafts",
  "Science", "History", "Animals/Pets", "Board Games"
];

