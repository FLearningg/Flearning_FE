import React from "react";
import "../../assets/homepage/Adverisement.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRightOutlined } from '@ant-design/icons';
function Advertisement() {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <>
      <div className="container-fluid desktop-homepage-view">
        <div className="row">
          <div className="col-6">
            <div className="h-100 d-flex flex-column justify-content-center align-items-start advertisement-text-container">
              <p className="advertisement-text">
                Learn with expert <br /> anytime anywhere
              </p>
              <p className="text-secondary advertisement-text-2">
                Our mission is to help people to find the best course online and
                learn with expert anytime, anywhere.
              </p>
              <div className="mt-4">
                <p className="h4 text-secondary mb-3">
                  Want to be an instructor?
                </p>
                <Link to="/instructor/register" className="btn-register-instructor">
                  <button className="">
                    Register now <ArrowRightOutlined />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-6 pe-0">
            <img
              src="/images/advertiment.jpg"
              alt=""
              className="w-100 img-cut-corner"
            />
          </div>
        </div>
      </div>
      <div className="movie-card tablet-view">
        <div className="content pt-5 text-center">
          <div className="intro-text">
            <p className="h3 px-4">Learn with expert anytime anywhere</p>
            <hr />
            <p className="h6 text-start fw-light ">
              Our mision is to help people to find the best course online and
              learn with expert anytime, anywhere.
            </p>
          </div>
          <hr />
          {!currentUser && (
            <Link to="/signup" className="btn-create-account">
              <button className="">Create account</button>
            </Link>
          )}
          <div className="mt-4">
            <p className="h4 text-secondary mb-3">
              Want to be an instructor?
            </p>
            <Link to="/instructor/register" className="btn-register-instructor">
              <button className="">
                Register now <ArrowRightOutlined />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Advertisement;
