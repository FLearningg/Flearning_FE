import {
  faArrowRight,
  faBullhorn,
  faCamera,
  faCreditCard,
  faCube,
  faDesktop,
  faHandshake,
  faHeartbeat,
  faLaptopCode,
  faMusic,
  faPaintBrush,
  faTags,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { use, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/homepage/TopCategory.css";
import CustomButton from "../common/CustomButton/CustomButton";
import TopCategoryCard from "./TopCategoryCard";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { useDispatch, useSelector } from "react-redux";
import { getTopCategories } from "../../services/categoryService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";

const bgColors = [
  "#f0f0ff",
  "#d0f0c0",
  "#ffe0b2",
  "#ffcccb",
  "#f0f8ff",
  "#f5f5f5",
  "#fff3e0",
  "#e0f7fa",
  "#fce4ec",
  "#f3e5f5",
  "#e8f5e9",
  "#fffde7",
];
const iconColors = [
  "#6366f1",
  "#4caf50",
  "#ff9800",
  "#ef4444",
  "#ff7f50",
  "#9e9e9e",
  "#ffb300",
  "#00bcd4",
  "#d81b60",
  "#ab47bc",
  "#43a047",
  "#fbc02d",
];

function getRandomColor() {
  return bgColors[Math.floor(Math.random() * bgColors.length)];
}

function getRandomIconColor() {
  return iconColors[Math.floor(Math.random() * iconColors.length)];
}

function TopCategory() {
  const categoryData1 = useSelector(
    (state) => state.categories.getCategories.categories
  );
  const isLoadding = useSelector(
    (state) => state.categories.getCategories.isLoading
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTopCategories = async () => {
      await getTopCategories(dispatch);
    };
    fetchTopCategories();
  }, [dispatch]);
  if (isLoadding) return <LoaddingComponent />;
  return (
    <>
      <div className="container py-5">
        <h3 className="text-center mb-5">Browse top category</h3>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {categoryData1?.map((category, index) => (
            <TopCategoryCard
              key={index}
              icon={category.icon}
              bgColor={getRandomColor()}
              iconColor={getRandomIconColor()}
              title={category.name}
              numberOfCourse={category.courseCount}
              linkToCategory={`/category?category=${category.name}`}
            />
          ))}
        </div>

        <div className="text-center mt-5">
          <p className="d-inline-block me-2">
            We have more category & subcategory.
          </p>
          <Link to="/category" className="browse-all text-decoration-none">
            Browse All <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default TopCategory;
