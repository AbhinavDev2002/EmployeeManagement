// VenueCard.js
import React from 'react';
import './VenueCard.css';
import img1 from "./Images/1.jpeg"
function VenueCard (props){
  const { image, title, badge, category, location, price } = props;
  return (
    <div className="venue-card">
      <div className="card-image">
        <img src={require(`${image}`)} alt={title} />
        <div className="featured-badge">{badge}</div>
      </div>
      <div className="card-details">
        <h2>{title}</h2>
        <p>{category}</p>
        <p>{location}</p>
      </div>
      <div className="card-footer">
        <p className="price">{price} onwards</p>
        <button className="book-now">Book Now</button>
      </div>
    </div>
  );
};

export default VenueCard;
