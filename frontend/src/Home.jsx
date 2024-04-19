import React from "react";
import "./Home.css";

function Home() {
  return (
   <div>
    <h1 className="Welcome">Welcome To Foursils Academy</h1>
     <div className="container">
      <div className="card-container">
        <div className="card">
          <blockquote>
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." - Malcolm X
          </blockquote>
        </div>
        <div className="card">
          <blockquote>
            "The only person who is educated is the one who has learned how to learn and change." - Carl Rogers
          </blockquote>
        </div>
        <div className="card">
          <blockquote>
            "Learning is a treasure that will follow its owner everywhere." - Chinese Proverb
          </blockquote>
        </div>
        <div className="card">
          <blockquote>
            "The beautiful thing about learning is that no one can take it away from you." - B.B. King
          </blockquote>
        </div>
      </div>
    </div>
   </div> 
   
  );
}

export default Home;


// export default Home;
