import { useEffect } from "react";
import SearchBox from "../common/search/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../services/courseService";
import { useNavigate } from "react-router-dom";
function SearchBar() {
  const courseData = useSelector((state) => state.courses.getCourses.courses);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      await getAllCourses(dispatch);
    };
    fetchCourses();
  }, [dispatch]);
  const data =
    courseData?.map((course) => ({
      label: course.title,
    })) || [];
  return (
    <>
      <SearchBox
        data={data}
        placeholder="Tìm kiếm môn học..."
        onSubmit={(searchTerm) => {
          navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
        }}
        // onSelect={(item) => console.log('Đã chọn:', item)}
      />
    </>
  );
}

export default SearchBar;
