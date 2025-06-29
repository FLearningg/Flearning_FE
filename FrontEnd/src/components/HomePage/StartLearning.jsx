import React from "react";
import { Link } from "react-router-dom";
import "../../assets/homepage/StartLearning.css";

function StartLearning() {
  return (
    <>
      <div className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h2>Start learning with 67.1k students around the world.</h2>
              <div className="mt-4 d-flex gap-4">
                <Link className="btn-create-account" to={"/"}>
                  <button className="p-2 px-3">Join The Family</button>
                </Link>
                <Link className="btn-browse-courses" to={"/"}>
                  <button className="p-2 px-3">Browse All Course</button>
                </Link>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-4 d-flex flex-column align-items-start">
                  <span style={{ fontSize: "2rem", fontWeight: 700 }}>
                    6.3k
                  </span>
                  <span
                    className="text-secondary"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Online courses
                  </span>
                </div>
                <div className="col-4 d-flex flex-column align-items-start">
                  <span style={{ fontSize: "2rem", fontWeight: 700 }}>26k</span>
                  <span
                    className="text-secondary"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Certified Instructor
                  </span>
                </div>
                <div className="col-4 d-flex flex-column align-items-start">
                  <span style={{ fontSize: "2rem", fontWeight: 700 }}>
                    99.9%
                  </span>
                  <span
                    className="text-secondary"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Success Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="m-0" />
    </>
  );
}

export default StartLearning;
