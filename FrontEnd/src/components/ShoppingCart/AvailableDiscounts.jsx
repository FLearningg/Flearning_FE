import React, { useState, useEffect } from "react";
import { getAvailableDiscountsForCourses } from "../../services/discountService";
import { toast } from "react-toastify";
import "../../assets/ShoppingCart/AvailableDiscounts.css";

const AvailableDiscounts = ({ courseIds, onSelectDiscount, courses = [] }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseIds && courseIds.length > 0) {
      fetchAvailableDiscounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(courseIds)]);

  const fetchAvailableDiscounts = async () => {
    try {
      setLoading(true);
      const response = await getAvailableDiscountsForCourses(courseIds);
      setDiscounts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch available discounts:", error);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDiscountValue = (discount) => {
    if (discount.type === "percent") {
      // Calculate total discount amount for all applicable courses
      let totalDiscount = 0;
      courses.forEach((course) => {
        // Check if discount applies to this course
        const appliesToThisCourse =
          !discount.applyCourses ||
          discount.applyCourses.length === 0 ||
          discount.applyCourses.some((dc) => dc._id === course._id || dc === course._id);

        if (appliesToThisCourse) {
          // Apply percent discount to ORIGINAL price of each individual course
          totalDiscount += course.originalPrice * (discount.value / 100);
        }
      });

      // Apply maximum discount limit if set
      if (discount.maximumDiscount > 0) {
        totalDiscount = Math.min(totalDiscount, discount.maximumDiscount);
      }

      return `${discount.value}% (~${Math.round(totalDiscount).toLocaleString('vi-VN')} VND)`;
    } else if (discount.type === "fixedAmount") {
      return `${discount.value.toLocaleString('vi-VN')} VND`;
    }
    return "";
  };

  const handleApplyDiscount = (discount) => {
    if (onSelectDiscount) {
      onSelectDiscount(discount);
      toast.success(`Discount "${discount.discountCode}" applied!`);
    }
  };

  if (loading) {
    return (
      <div className="available-discounts-simple">
        <h3 className="available-discounts-title">Available Discounts</h3>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (discounts.length === 0) {
    return null;
  }

  return (
    <div className="available-discounts-simple">
      <h3 className="available-discounts-title">
        Available Discounts ({discounts.length})
      </h3>

      <div className="discounts-simple-list">
        {discounts.map((discount) => (
          <div key={discount._id} className="discount-simple-item">
            <div className="discount-simple-info">
              <span className="discount-code">{discount.discountCode}</span>
              <span className="discount-value">{formatDiscountValue(discount)}</span>
            </div>
            <button
              className="apply-btn"
              onClick={() => handleApplyDiscount(discount)}
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableDiscounts;
