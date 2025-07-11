import BestSelling from "./BestSelling";
import PopularKeywords from "./PopularKeywords";
import PopularTools from "./PopularTools";
import CourseScreen from "./CourseScreen";

const CategoryPage = () => {
  return (
    <div
      style={{
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: "14%",
        paddingRight: "14%",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ width: "100%" }}>
        <BestSelling />
      </div>
      <div style={{ width: "100%" }}>
        <PopularTools />
      </div>
      <div style={{ width: "100%" }}>
        <PopularKeywords />
      </div>
      <div style={{ width: "100%" }}>
        <CourseScreen />
      </div>
    </div>
  );
};

export default CategoryPage;
