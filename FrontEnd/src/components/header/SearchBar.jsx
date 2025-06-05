import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBox from '../common/search/SearchBox/SearchBox';
function SearchBar() {
    const data = [
        { label: 'Mathematics' },
        { label: 'Physics' },
        { label: 'Chemistry' },
        { label: 'Biology' },
    ];
    return (
        <>
            <SearchBox
                data={data}
                placeholder="Tìm kiếm môn học..."
                // onSelect={(item) => console.log('Đã chọn:', item)}
            />
        </>
    )
}

export default SearchBar
