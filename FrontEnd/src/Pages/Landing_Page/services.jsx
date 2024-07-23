import React from "react";
import './css/service.css'
export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="service-container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            We Provide Employee Management Services which includes:
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <i className={d.icon}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
