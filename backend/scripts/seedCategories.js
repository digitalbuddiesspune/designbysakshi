import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  {
    name: 'Necklace Sets',
    slug: 'necklace-sets',
    discountedPrice: 0,
    subcategories: [
      { name: 'AD Choker Sets', slug: 'ad-choker-sets' },
      { name: 'AD Bridal Sets', slug: 'ad-bridal-sets' },
      { name: 'AD Long Necklace Sets', slug: 'ad-long-necklace-sets' },
      { name: 'AD Layered Necklace Sets', slug: 'ad-layered-necklace-sets' },
      { name: 'Lightweight Necklace Sets', slug: 'lightweight-necklace-sets' },
      { name: 'Party Wear Necklace Sets', slug: 'party-wear-necklace-sets' },
      { name: 'Statement Necklace Sets', slug: 'statement-necklace-sets' }
    ]
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    discountedPrice: 0,
    subcategories: [
      { name: 'AD Stud Earrings', slug: 'ad-stud-earrings' },
      { name: 'AD Jhumka Earrings', slug: 'ad-jhumka-earrings' },
      { name: 'AD Drop Earrings', slug: 'ad-drop-earrings' },
      { name: 'AD Dangle Earrings', slug: 'ad-dangle-earrings' }
    ]
  },
  {
    name: 'Rings',
    slug: 'rings',
    discountedPrice: 0,
    subcategories: [
      { name: 'Adjustable Rings', slug: 'adjustable-rings' },
      { name: 'Cocktail Rings', slug: 'cocktail-rings' },
      { name: 'Minimal Rings', slug: 'minimal-rings' },
      { name: 'Daily Wear Rings', slug: 'daily-wear-rings' }
    ]
  },
  {
    name: 'Bangles & Bracelets',
    slug: 'bangles-bracelets',
    discountedPrice: 0,
    subcategories: [
      { name: 'AD Bangles', slug: 'ad-bangles' },
      { name: 'AD Kada', slug: 'ad-kada' },
      { name: 'AD Tennis Bracelets', slug: 'ad-tennis-bracelets' },
      { name: 'Stackable Bangles', slug: 'stackable-bangles' }
    ]
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    discountedPrice: 0,
    subcategories: [
      { name: 'Pendant with Chain', slug: 'pendant-with-chain' },
      { name: 'Pendant Sets', slug: 'pendant-sets' },
      { name: 'Minimal Pendants', slug: 'minimal-pendants' }
    ]
  },
  {
    name: 'Bridal Jewellery',
    slug: 'bridal-jewellery',
    discountedPrice: 0,
    subcategories: [
      { name: 'Bridal Necklace Sets', slug: 'bridal-necklace-sets' },
      { name: 'AD Maang Tikka', slug: 'ad-maang-tikka' },
      { name: 'AD Nath', slug: 'ad-nath' },
      { name: 'Bridal Bangles', slug: 'bridal-bangles' },
      { name: 'Full Bridal Sets', slug: 'full-bridal-sets' }
    ]
  },
  {
    name: 'Anklets',
    slug: 'anklets',
    discountedPrice: 0,
    subcategories: [
      { name: 'AD Anklets', slug: 'ad-anklets' },
      { name: 'Double Layer Anklets', slug: 'double-layer-anklets' },
      { name: 'Bridal Anklets', slug: 'bridal-anklets' }
    ]
  }
];

const seedCategories = async () => {
  try {
    await connectDB();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
