import CourseScreen from "./CourseScreen";

const CoursePage = () => {
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
        <CourseScreen />
      </div>
    </div>
  );
};

export default CoursePage;
