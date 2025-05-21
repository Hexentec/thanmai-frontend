// app/components/CategoriesGrid.jsx
'use client';

import React from "react";
import Link from "next/link";
import "../../styles/components/CategoriesGrid.css";

const categories = [
  {
    name: "Veg",
    image: "/assets/dummy-veg.png",
    link: "/shop/veg",
  },
  {
    name: "Non-Veg",
    image: "/assets/dummy-nonveg.png",
    link: "/shop/non-veg",
  },
  {
    name: "Must Try",
    image: "/assets/dummy1.png",
    link: "/must-try",
  },
  {
    name: "Bulk Orders",
    image: "/assets/bulk-order.png",
    link: "/bulk-orders",
  },
];

const CategoriesGrid = () => {
  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <Link href={category.link} key={category.name} className="category-card">
          <img src={category.image} alt={category.name} />
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesGrid;
