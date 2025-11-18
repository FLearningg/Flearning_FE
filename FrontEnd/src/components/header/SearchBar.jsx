import { useEffect } from "react";
import SearchBox from "../common/search/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../services/courseService";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const courseData = useSelector((state) => state.courses.getCourses.courses);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      await getAllCourses(dispatch);
    };
    fetchCourses();
  }, [dispatch]);

  const hideOnPaths = ["/courses", "/category"];

  const shouldHide = hideOnPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHide) {
    return null;
  }

  const data =
    courseData?.map((course) => ({
      label: course.title,
    })) || [];

  // 1. Tạo một hàm xử lý điều hướng thống nhất
  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <SearchBox
        data={data}
        placeholder="Tìm kiếm môn học..."
        onSubmit={handleSearch}
        onSelect={(item) => {
          handleSearch(item.label);
        }}
      />
    </>
  );
}

export default SearchBar;
