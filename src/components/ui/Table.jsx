import React from "react";

const Table = ({
  columns = [],
  data = [],
  rowKey = "id",
  indexColumn = false,
  stickedHeader = false,
  border = false,
  selectedItems = [],
  onRowClick = () => {},
  onRowDoubleClick = () => {},
  actionsRender,
}) => {
  return (
    <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className={`bg-gray-50 ${stickedHeader && "sticky top-0 z-10"}`}>
          <tr>
            {indexColumn && (
              <th className={`w-20 whitespace-nowrap py-3.5 pl-4 sm:pl-6 pr-3 text-left text-xs lg:text-sm font-semibold text-gray-900 ${border && 'border border-gray-200'}`}>
                #
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={col.accessor ?? idx}
                scope="col"
                className={`py-4 px-3 text-left text-xs lg:text-sm font-semibold text-gray-900 ${
                  idx === 0 && !indexColumn ? "pl-4 sm:pl-6" : ""
                } ${col.headerClassName ?? ""} ${border && 'border border-gray-200'}`}
              >
                {col.header}
              </th>
            ))}
            {actionsRender && (
              <th className={`relative py-4 px-3 sm:pr-6 ${border && 'border border-gray-200'}`}>
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className={"bg-white"}>
          {data.map((item, rowIdx) => (
            <tr
              key={item[rowKey] ?? rowIdx}
              className={`${
                selectedItems.some(selectedItem => selectedItem[rowKey] === item[rowKey])
                  ? "bg-indigo-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onRowClick(item)}
              onDoubleClick={() => onRowDoubleClick(item[rowKey], item)}
            >
              {indexColumn && (
                <td className={`w-20 whitespace-nowrap py-4 pl-4 sm:pl-6 pr-3 text-xs lg:text-sm font-medium text-gray-900 ${border && 'border border-gray-200'}`}>
                  {rowIdx + 1}
                </td>
              )}
              {columns.map((col, colIdx) => (
                <td
                  key={col.accessor ?? colIdx}
                  onClick={() => {
                    if (col.onClickTd) {
                      col.onClickTd(item);
                    }
                  }}
                  onDoubleClick={() => {
                    if (col.onDoubleClickTd) {
                      col.onDoubleClickTd(item);
                    }
                  }}
                  className={`whitespace-nowrap py-4 px-3 text-xs lg:text-sm text-gray-900 ${
                    colIdx === 0 && !indexColumn ? "pl-4 sm:pl-6 font-medium" : ""
                  } ${col.cellClassName ?? ""} ${border && 'border border-gray-200'}`}
                >
                  {col.render
                    ? col.render(item)
                    : item[col.accessor]}
                </td>
              ))}
              {actionsRender && (
                <td className={`relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-xs lg:text-sm font-medium sm:pr-6 ${border && 'border border-gray-200'}`}>
                  {actionsRender(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;