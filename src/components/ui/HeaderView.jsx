
import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router";

const HeaderView = ({title, children, back = false}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {back && (
            <Link to={back} className="hover:text-indigo-600">
              <FaArrowCircleLeft className="w-6 h-6" />
            </Link>
          )}
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex space-x-4">
          {children}
        </div>
      </div>
    </header>
  )
}

export default HeaderView;