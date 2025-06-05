import React from 'react';
import DropdownItem from '../DropdownItem/DropdownItem';
import styles from './DropdownList.module.css';

const DropdownList = ({ items, onItemClick, isVisible }) => {
    if (!isVisible || !items || items.length === 0) {
        return null;
    }
    return (
        <ul className={styles.dropdownList}>
          {items.map((item) => (
            <DropdownItem key={item.id} item={item} onClick={onItemClick} />
          ))}
        </ul> 
    );
};

export default DropdownList;