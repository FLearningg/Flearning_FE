import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../../assets/Categories/PopularKeywords.css";

export default function PopularKeywords() {
  const keywords = [
    "HTML 5",
    "Web Development",
    "Developments",
    "Programing",
    "Website",
    "Technology",
    "Wordpress",
  ];

  const [activeKeyword, setActiveKeyword] = useState("Developments");

  return (
    <div className="keywords-container">
      <div className="d-flex align-items-center gap-2">
        <span className="keywords-label">Popular keyword:</span>
        <Swiper
          spaceBetween={12}
          slidesPerView="auto"
          grabCursor={true}
          style={{ padding: "4px 0" }}
        >
          {keywords.map((keyword) => (
            <SwiperSlide key={keyword} style={{ width: "auto" }}>
              <button
                className={`keyword-btn ${
                  activeKeyword === keyword ? "active" : ""
                }`}
                onClick={() => setActiveKeyword(keyword)}
              >
                {keyword}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
