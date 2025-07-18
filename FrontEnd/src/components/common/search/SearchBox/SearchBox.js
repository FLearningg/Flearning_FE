import React, { useState, useEffect, useRef } from "react";
import SearchInput from "../SearchInput/SearchInput";
import DropdownList from "../DropdownList/DropdownList";
import styles from "./SearchBox.module.css";

const SearchBox = ({
  data = [],
  placeholder = "Search...",
  onSelect,
  onSubmit,
  onCategoryClick,
  categoryLabel = "Browse",
  containerClassName,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isUiOpen, setIsUiOpen] = useState(false); // Controls visibility of dropdown/message area
  const searchBoxRef = useRef(null);

  useEffect(() => {
    // Filter data when search term changes and UI is open
    if (searchTerm && isUiOpen) {
      const results = data.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(results);
    } else {
      // Clear filtered data if no search term or UI is closed
      setFilteredData([]);
    }
  }, [searchTerm, data, isUiOpen]);

  useEffect(() => {
    // Handle clicks outside the search box to close the UI
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setIsUiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm) {
      setIsUiOpen(true); // Show UI when user starts typing
    } else {
      setIsUiOpen(false); // Hide UI if search term is cleared
      setFilteredData([]); // Explicitly clear data
    }
  };

  const handleInputFocus = () => {
    setIsUiOpen(true); // Show UI when input is focused
  };

  const handleItemClick = (item) => {
    setSearchTerm(item.label); // Set input value to selected item's label
    setIsUiOpen(false); // Hide UI after selection
    if (onSelect) {
      onSelect(item);
    }
  };
  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      // Submit search or call onSelect with current searchTerm
      if (onSubmit) {
        onSubmit(searchTerm); // Gọi callback submit nếu có
        setSearchTerm("");
      } else if (searchTerm) {
        // If no results, you can handle submit searchTerm here
        // For example: onSelect({ label: searchTerm });
        if (onSelect) onSelect({ label: searchTerm });
      }
    }
  };

  return (
    <div
      className={`${styles.searchBoxContainer} ${containerClassName || ""}`}
      ref={searchBoxRef}
    >
      <SearchInput
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        // onBlur is not directly managed here, handleClickOutside handles it for the UI area
        placeholder={placeholder}
        onCategoryClick={onCategoryClick}
        categoryLabel={categoryLabel}
      />
      {isUiOpen && (
        <>
          {filteredData.length > 0 && (
            <DropdownList
              items={filteredData}
              onItemClick={handleItemClick}
              isVisible={true} // DropdownList is rendered only if items exist and UI is open
            />
          )}
          {/* Show "No results found" if there's a search term, UI is open, but no results */}
          {searchTerm && filteredData.length === 0 && (
            <div className={styles.noResultsDropdown}>
              {" "}
              {/* Add this class to your CSS module */}
              No results found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBox;
