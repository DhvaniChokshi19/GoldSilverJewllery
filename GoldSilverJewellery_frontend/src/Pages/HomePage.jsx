import React from "react";
import homebanner from "../assets/BANNER1.png";
import Carousel from "../Components/Carousel";

const HomePage = () => {
  return (
    <div className="">
    <div className="w-full flex">      
      <img className="w-full h-auto" src={homebanner} alt="" />
    </div>
    <div className="w-full flex flex-col items-center text-center mt-6">
      <div className="text-center">
       <Carousel></Carousel>
      </div>
      <div className="gold-display">
        
      </div>
    </div>
    </div>
    
  );
};

export default HomePage;
