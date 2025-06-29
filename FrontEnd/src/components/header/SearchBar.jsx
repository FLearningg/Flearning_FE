import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import SearchBox from "../common/search/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../services/courseService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";
function SearchBar() {
  const courseData = useSelector((state) => state.courses.getCourses.courses);
  const isLoading = useSelector((state) => state.courses.getCourses.isLoading);
  const dispatch = useDispatch();
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
  if (isLoading) {
    return <LoaddingComponent />;
  }
  return (
    <>
      <SearchBox
        data={data}
        placeholder="Tìm kiếm môn học..."
        // onSelect={(item) => console.log('Đã chọn:', item)}
      />
    </>
  );
}

export default SearchBar;
