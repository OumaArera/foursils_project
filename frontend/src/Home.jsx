import React from "react";
import "./Home.css";

function Home() {
  return (
  <div>
    <h1 className="Welcome">Welcome To Foursils Academy</h1>
    <div className="para-container">
    <div className="para">
    <p>
    "Embark on a journey of knowledge and transformation with 
    The Foursils Academy – where curiosity meets enlightenment, 
    and every click opens the door to boundless possibilities. 
    Join us in exploring the realms of learning, discovery, and growth.
    Your invitation awaits at The Foursils Academy – where learning is an adventure,
    and wisdom is the ultimate destination."
    </p>
    </div>
    </div>
     <div className="container">
      <div className='homeimg'>
      <img src="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D" alt="" class="element" id="mw-element-1713723"/>
      </div>
      <div className='homeimg1'>
      <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="" class="element" id="mw-element-1713723"/>
      </div>
      <div className="homeicon1">
      <img loading="lazy" src="https://718448.microweber.me/userfiles/templates/online-learning/assets/img/layouts/new-templates/service-01.png" alt="" class="element" id="mw-element-1713723627026"/>
      </div>
      <div className="homeicon2">
      <img loading="lazy" src="https://718448.microweber.me/userfiles/templates/online-learning/assets/img/layouts/new-templates/service-02.png" alt="" class="element" id="mw-element-1713723627026"/>
      </div>
      <div className="homeicon3">
      <img loading="lazy" src="https://718448.microweber.me/userfiles/templates/online-learning/assets/img/layouts/new-templates/service-03.png" alt="" class="element" id="mw-element-1713723627026"/>
      </div>
    </div>
   </div> 
   
  );
}

export default Home;


// export default Home;
