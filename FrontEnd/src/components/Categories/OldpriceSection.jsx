<Section title="Price" sectionKey="price">
  <>
    <input
      type="range"
      className="form-range mb-2"
      min="0"
      max={MAX_PRICE || 500000} // Sử dụng MAX_PRICE
      value={priceRange[1]}
      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
    />
    <div className="d-flex gap-2 align-items-center mb-2">
      <span>VND</span>
      <input
        type="number"
        value={priceRange[0]}
        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
        className="form-control form-control-sm"
        placeholder="min"
      />
      <span>-</span>
      <input
        type="number"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
        className="form-control form-control-sm"
        placeholder="max"
      />
    </div>

    {/* Sửa lại Paid và Free để kết nối state và hiển thị count */}
    <div className="d-flex justify-content-between align-items-center mb-1">
      <div className="form-check">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="paid"
          checked={selectedPriceTypes.includes("Paid")}
          onChange={() =>
            handleCheckboxChange(
              "Paid",
              selectedPriceTypes,
              setSelectedPriceTypes
            )
          }
        />
        <label className="form-check-label" htmlFor="paid">
          Paid
        </label>
      </div>
      <span className="text-muted small ms-2 flex-shrink-0">
        {priceCounts?.Paid || 0}
      </span>
    </div>
    <div className="d-flex justify-content-between align-items-center mb-1">
      <div className="form-check">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="free"
          checked={selectedPriceTypes.includes("Free")}
          onChange={() =>
            handleCheckboxChange(
              "Free",
              selectedPriceTypes,
              setSelectedPriceTypes
            )
          }
        />
        <label className="form-check-label" htmlFor="free">
          Free
        </label>
      </div>
      <span className="text-muted small ms-2 flex-shrink-0">
        {priceCounts?.Free || 0}
      </span>
    </div>
  </>
</Section>;
