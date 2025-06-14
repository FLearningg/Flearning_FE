import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
const generatePageNumbers = (currentPage, totalPages) => {
    const maxPagesToShow = 5;
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(1, '...', currentPage,  '...', totalPages);
        }
    }
    return pageNumbers;
};

const CartPagePagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = generatePageNumbers(currentPage, totalPages);

    return (
        <div className="d-flex justify-content-center my-3 flex-wrap">
            <button
                className="btn btn-outline-secondary mx-1 mt-2"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {pages.map((page, idx) =>
                page === '...' ? (
                    <span key={idx} className="btn mx-1 mt-2 disabled text-muted">...</span>
                ) : (
                    <button
                        key={idx}
                        className={`btn mx-1 mt-2 ${currentPage === page ? 'btn-primary cart-button-primary' : 'btn-outline-primary cart-button-outline'}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="btn btn-outline-secondary mx-1 mt-2"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

export default CartPagePagination;
