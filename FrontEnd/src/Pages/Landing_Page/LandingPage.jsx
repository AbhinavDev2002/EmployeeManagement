// This will be the page which will be opened when the users open the application
import React, { useState, useEffect } from "react";
import Introduction from "./Intro";
import { Services } from "./services";
import { About } from "./about";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";


export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000,
    speedAsDuration: true,
});

function LandingPage(){
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
      setLandingPageData(JsonData);
    }, []);

    return(
        <div>
            <Introduction/>
            {/* <About data = {landingPageData.About}/> */}
            <Services data = {landingPageData.Services}/>
        </div>
    );
}
export default LandingPage;