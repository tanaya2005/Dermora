export interface Dermatologist {
  id: string;
  name: string;
  title: string;
  specialization: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  experience: string;
  availability: string;
}

export const dermatologists: Dermatologist[] = [
  {
    id: "derm-1",
    name: "Dr. Sarah Jenkins",
    title: "MD, FAAD - Board Certified Dermatologist",
    specialization: "Acne & Anti-Aging Specialist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    price: 800,
    rating: 4.9,
    reviews: 124,
    experience: "12 years",
    availability: "Available Tomorrow"
  },
  {
    id: "derm-2",
    name: "Dr. Amit Patel",
    title: "MD, DNB - Dermatologist & Cosmetologist",
    specialization: "Hyperpigmentation & Sensitive Skin",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    price: 1000,
    rating: 4.8,
    reviews: 98,
    experience: "15 years",
    availability: "Available Today"
  },
  {
    id: "derm-3",
    name: "Dr. Elena Rostova",
    title: "MD, PhD - Pediatric Dermatologist",
    specialization: "Eczema, Psoriasis & Allergy Care",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300",
    price: 1200,
    rating: 4.95,
    reviews: 142,
    experience: "10 years",
    availability: "Available Monday"
  }
];

export const consultationBookings = [];
