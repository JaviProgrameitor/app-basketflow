
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";

const Breadcrumb = ({ path }) => {
  return (
    <div className="bg-white px-6 py-3 border-b flex items-center text-sm">
      {
        path.map((item, index) => (
          typeof item === 'string' 
            ? (
              <React.Fragment key={index}>
                {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
                <button className="text-indigo-600 hover:text-indigo-800">
                  {item}
                </button>
              </React.Fragment>
            ) 
            : (
              <Link
                key={index}
                to={item.path}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
                <button className="text-indigo-600 hover:text-indigo-800">
                  {item.title}
                </button>
              </Link>
            )
        ))
      }
    </div>
  )
}

export default Breadcrumb;