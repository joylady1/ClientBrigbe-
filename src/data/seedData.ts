import { Professional, Review, ServiceCategory } from '../types';

export const NIGERIAN_STATES = [
  "All Nigeria", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "all", name: "All Categories", icon: "✨", tagline: "All registered Nigerian services" },
  { id: "graphic-design", name: "Graphic Designers", icon: "🎨", tagline: "Brand identity, logos & social packaging" },
  { id: "web-dev", name: "Web Developers", icon: "💻", tagline: "Fullstack apps, Paystack stores & business sites" },
  { id: "photography", name: "Photographers", icon: "📷", tagline: "Weddings, studio portraits & corporate events" },
  { id: "videography", name: "Videographers", icon: "🎥", tagline: "Documentary, YouTube & commercial ads" },
  { id: "fashion", name: "Fashion Designers", icon: "✂️", tagline: "Bespoke Aso-Ebi, agbada & luxury suits" },
  { id: "baking", name: "Bakers & Caterers", icon: "🎂", tagline: "Architectural wedding cakes & gourmet feasts" },
  { id: "makeup", name: "Makeup Artists", icon: "💄", tagline: "Bridal glam, editorial & photo sessions" },
  { id: "hair", name: "Hair Stylists", icon: "💇", tagline: "Wig revamping, braids & luxury installs" },
  { id: "electrical", name: "Electricians & Solar", icon: "⚡", tagline: "Hybrid inverters, solar audits & house wiring" },
  { id: "plumbing", name: "Plumbers", icon: "🔧", tagline: "Piping, water tank setup & pump troubleshooting" },
  { id: "cleaning", name: "Cleaners", icon: "🧹", tagline: "Post-construction, deep home & corporate hygiene" },
  { id: "mechanic", name: "Mechanics", icon: "🚗", tagline: "Diagnostics, Japanese & European car servicing" },
  { id: "tutoring", name: "Tutors", icon: "📚", tagline: "WAEC, UTME, coding & music mentors" },
  { id: "training", name: "Fitness Trainers", icon: "🏋️", tagline: "Weight loss, strength & tailored meal plans" },
  { id: "digital-marketing", name: "Digital Marketers", icon: "📈", tagline: "Meta ads, SEO & influencer management" }
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: "pro-1",
    userId: "seed-user-1",
    name: "Babajide 'Jay' Adeleke",
    businessName: "Adeleke Visuals & Branding",
    category: "graphic-design",
    categoryLabel: "Graphic Designers",
    state: "Lagos",
    city: "Ikeja / Victoria Island",
    rating: 4.9,
    reviewsCount: 38,
    startingPrice: 35000,
    phone: "8032114455",
    verified: true,
    completedJobs: 142,
    responseTime: "within 1 hour",
    badges: ["Identity Verified", "Top Rated 2026", "Fast Responder"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Specializing in Afrocentric visual identities, luxury packaging, and investor pitch decks for fast-growing Nigerian tech startups and retail powerhouses.",
    portfolio: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "Brand Identity & Logo Guide - ₦95,000",
      "Social Media Growth Kit (30 Assets) - ₦45,000",
      "Product Packaging & 3D Mockups - ₦60,000",
      "Investor Pitch Deck Polish - ₦80,000"
    ]
  },
  {
    id: "pro-2",
    userId: "seed-user-2",
    name: "Chioma Okonkwo",
    businessName: "Chioma Okonkwo Couture",
    category: "fashion",
    categoryLabel: "Fashion Designers",
    state: "Enugu",
    city: "Independence Layout",
    rating: 5.0,
    reviewsCount: 52,
    startingPrice: 28000,
    phone: "8067891234",
    verified: true,
    completedJobs: 215,
    responseTime: "within 2 hours",
    badges: ["Master Tailor", "Nationwide Dispatch", "5.0 Flawless"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Bespoke bridal wear, contemporary Aso-Ebi statements, and executive RTW suits. Precision measurements, premium African fabrics, and prompt nationwide dispatch via DHL/GIG.",
    portfolio: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "Bridal Traditional Reception Gown - ₦140,000",
      "Custom Lace Aso-Ebi Tailoring - ₦35,000",
      "Corporate Two-Piece Blazer Suit - ₦45,000",
      "Men's Senator Suit with Embroidery - ₦38,000"
    ]
  },
  {
    id: "pro-3",
    userId: "seed-user-3",
    name: "Engr. Nura Mohammed",
    businessName: "Northern Spark Solar & Electricals",
    category: "electrical",
    categoryLabel: "Electricians & Solar",
    state: "FCT Abuja",
    city: "Gwarinpa / Maitama",
    rating: 4.8,
    reviewsCount: 29,
    startingPrice: 15000,
    phone: "8023456789",
    verified: true,
    completedJobs: 89,
    responseTime: "within 30 mins",
    badges: ["Licensed Engineer", "Solar Specialist", "Safety First"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Certified residential & commercial electrical engineer. Expert in solar hybrid inverter installations, Lithium-ion battery audits, circuit troubleshooting, and smart-home automation.",
    portfolio: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "5kVA Solar Hybrid Inverter Setup - ₦85,000",
      "Full 3-Bedroom Rewiring & Safety Audit - ₦45,000",
      "Emergency Circuit Diagnostic - ₦15,000",
      "Automatic Changeover Switch Installation - ₦25,000"
    ]
  },
  {
    id: "pro-4",
    userId: "seed-user-4",
    name: "Tariere Briggs",
    businessName: "Creek Lens Visuals",
    category: "photography",
    categoryLabel: "Photographers",
    state: "Rivers",
    city: "Port Harcourt (GRA)",
    rating: 4.9,
    reviewsCount: 44,
    startingPrice: 50000,
    phone: "8134567890",
    verified: true,
    completedJobs: 110,
    responseTime: "within 1 hour",
    badges: ["Sony Pro", "Event Specialist"],
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    bio: "Documentary weddings, oil & gas corporate event coverage, and editorial portraits across the Niger Delta region. Delivery includes retouched digital gallery and fine art photobooks.",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "Full Day Traditional Wedding Coverage - ₦350,000",
      "Studio Executive Headshots (5 Retouched) - ₦50,000",
      "Corporate Summit & Dinner Shoot - ₦180,000",
      "Outdoor Lifestyle & Birthday Session - ₦65,000"
    ]
  },
  {
    id: "pro-5",
    userId: "seed-user-5",
    name: "Olumide Bakare",
    businessName: "NaijaCode Labs",
    category: "web-dev",
    categoryLabel: "Web Developers",
    state: "Lagos",
    city: "Yaba Tech Hub / Lekki",
    rating: 5.0,
    reviewsCount: 67,
    startingPrice: 85000,
    phone: "8091234567",
    verified: true,
    completedJobs: 175,
    responseTime: "within 45 mins",
    badges: ["Full Stack Pro", "Paystack Certified", "Fast Delivery"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Full-stack engineer building fast, responsive e-commerce web applications with Paystack and Flutterwave payment integrations, mobile-first dashboards, and SEO optimization.",
    portfolio: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "E-Commerce Store with Paystack Integration - ₦180,000",
      "Corporate Business Portal & Domain - ₦120,000",
      "Custom Web App MVP Development - ₦300,000",
      "Website Speed & Mobile Fix Audit - ₦45,000"
    ]
  },
  {
    id: "pro-6",
    userId: "seed-user-6",
    name: "Hadiza Garba",
    businessName: "Arewa Confectionery & Treats",
    category: "baking",
    categoryLabel: "Bakers & Caterers",
    state: "Kano",
    city: "Nassarawa GRA",
    rating: 4.8,
    reviewsCount: 31,
    startingPrice: 20000,
    phone: "8076543210",
    verified: true,
    completedJobs: 98,
    responseTime: "within 2 hours",
    badges: ["Master Baker", "Halal Certified"],
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    bio: "Crafting multi-tier architectural wedding cakes, artisanal pastries, and Northern finger foods. Fresh ingredients, exquisite sugar flowers, and punctual event setup.",
    portfolio: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "3-Tier Custom Architectural Wedding Cake - ₦160,000",
      "Gourmet Birthday Cake (Velvet & Chocolate) - ₦25,000",
      "Small Chops & Pastries Party Platter (50 Guests) - ₦65,000"
    ]
  },
  {
    id: "pro-7",
    userId: "seed-user-7",
    name: "Emeka 'Flash' Eze",
    businessName: "FlashFlow Plumbing Solutions",
    category: "plumbing",
    categoryLabel: "Plumbers",
    state: "Oyo",
    city: "Bodija / Ring Road, Ibadan",
    rating: 4.7,
    reviewsCount: 22,
    startingPrice: 12000,
    phone: "8056789012",
    verified: true,
    completedJobs: 65,
    responseTime: "within 15 mins",
    badges: ["Rapid Response", "Leak Detector"],
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    bio: "Piping installations, water pump repair, borehole overhead tank setup, and hidden leak detection for modern duplexes and apartment blocks in Oyo state.",
    portfolio: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "Water Tank & Pressure Pump Setup - ₦35,000",
      "Bathroom Sanitary Ware Installation - ₦20,000",
      "Underground Pipe Leak Detection & Fix - ₦15,000"
    ]
  },
  {
    id: "pro-8",
    userId: "seed-user-8",
    name: "Blessing Bassey",
    businessName: "Lush Touch Makeover",
    category: "makeup",
    categoryLabel: "Makeup Artists",
    state: "Cross River",
    city: "Calabar Municipal",
    rating: 4.9,
    reviewsCount: 47,
    startingPrice: 25000,
    phone: "8089900112",
    verified: true,
    completedJobs: 130,
    responseTime: "within 30 mins",
    badges: ["Bridal Glam", "HD Finishes"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Pro HD bridal makeup, traditional Moninkim & Calabar bride styling, gele tying, and photoshoot glam. Waterproof, long-lasting products guaranteed.",
    portfolio: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
    ],
    servicesList: [
      "Full Traditional & White Wedding Makeup - ₦90,000",
      "Event Guest Glam + Gele Tying - ₦25,000",
      "Studio / Birthday Glam Look - ₦30,000"
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    proId: "pro-1",
    author: "Femi Adele",
    rating: 5,
    date: "2 days ago",
    comment: "Babajide gave our fintech venture in Yaba an iconic logo! His revisions were swift and he met our tight deadline before our seed round announcement.",
    verifiedHire: true
  },
  {
    id: "rev-2",
    proId: "pro-3",
    author: "Hajiya Maryam",
    rating: 5,
    date: "Last week",
    comment: "Engr Nura restored our inverter system in Maitama within 3 hours. Very honest, respectful and clean technician. No shady talk about spare parts.",
    verifiedHire: true
  },
  {
    id: "rev-3",
    proId: "pro-2",
    author: "Kelechi U.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Chioma's fitting for my sister's traditional wedding was exquisite. Received compliments all day! Dispatched safely to Port Harcourt right on time.",
    verifiedHire: true
  },
  {
    id: "rev-4",
    proId: "pro-5",
    author: "Kunle Solanke",
    rating: 5,
    date: "3 weeks ago",
    comment: "Olumide integrated Paystack and configured our Lagos courier delivery system in 48 hours. Our sales converted immediately.",
    verifiedHire: true
  }
];
