// App.js
import React from 'react';
import VenueCard from './VenueCard';
import './MainVenueCard.css';

const cardItems = [
  {
    image: "./Images/1.jpeg",
    title: 'Creative Food Catering',
    badge: "Premium",
    category: 'Wedding Caterers',
    location: 'Delhi NCR',
    price: '₹ 1,200',
  },
  {
    image: './Images/2.jpeg',
    title: 'PC Caterers & Decorators',
    badge: "Gold",
    category: 'Wedding Caterers',
    location: 'Delhi NCR',
    price: '₹ 80,000',
  },
  {
    image: './Images/3.jpeg',
    title: 'Om Ji Caterers Event & Decorators',
    badge: "Special Edition",
    category: 'Wedding Caterers',
    location: 'Faridabad, Delhi NCR',
    price: '₹ 500',
  },
  {
    image: './Images/4.jpeg',
    title: 'Batra Caterers',
    badge: "Premium",
    category: 'Wedding Caterers',
    location: 'Jeevan Vihar, Delhi NCR',
    price: '₹ 900',
  },
  // Add more card items as needed
];

function MainVenueCard() {
  return (
    <div className="Main-Card">
      <div className="Main-Card-container">
        {cardItems.map((item, index) => (
          <VenueCard
            key={index}
            badge = {item.badge}
            image={item.image}
            title={item.title}
            category={item.category}
            location={item.location}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default MainVenueCard;
