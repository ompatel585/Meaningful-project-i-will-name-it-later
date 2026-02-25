import { useState } from "react";

const TableMap = ({
  tables = [],
  selectedTable,
  onTableSelect,
  readOnly = false,
  partySize = 2,
  selectedDate = "",
  selectedTime = "",
  bookedTables = [],
}) => {
  const [hoveredTable, setHoveredTable] = useState(null);

  // Default restaurant layout size
  const mapWidth = 600;
  const mapHeight = 400;

  // Check if a table is available
  const isTableAvailable = (table) => {
    if (!readOnly && bookedTables.includes(table.tableNumber)) {
      return false;
    }
    if (table.capacity < partySize) {
      return false;
    }
    return table.isAvailable !== false;
  };

  // Get table status
  const getTableStatus = (table) => {
    if (!readOnly && bookedTables.includes(table.tableNumber)) {
      return "booked";
    }
    if (table.capacity < partySize) {
      return "insufficient";
    }
    if (!table.isAvailable) {
      return "unavailable";
    }
    if (selectedTable === table.tableNumber) {
      return "selected";
    }
    return "available";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "bg-indigo-500 border-indigo-600 shadow-lg shadow-indigo-500/50";
      case "booked":
        return "bg-red-300 border-red-400 cursor-not-allowed";
      case "insufficient":
        return "bg-gray-200 border-gray-300 cursor-not-allowed opacity-50";
      case "unavailable":
        return "bg-gray-300 border-gray-400 cursor-not-allowed";
      default:
        return "bg-emerald-400 border-emerald-500 hover:bg-emerald-300 cursor-pointer";
    }
  };

  // Render table shape based on capacity
  const renderTableShape = (table, status) => {
    const size = Math.min(40 + table.capacity * 8, 100);
    const isLarge = table.capacity > 6;

    if (isLarge) {
      // Large table (oval for 6+ people)
      return (
        <ellipse
          cx="50%"
          cy="50%"
          rx={size / 2}
          ry={size / 3}
          className={getStatusColor(status)}
          strokeWidth="3"
        />
      );
    }

    // Regular table (circle)
    return (
      <circle r={size / 2} className={getStatusColor(status)} strokeWidth="3" />
    );
  };

  // Handle table click
  const handleTableClick = (table) => {
    if (readOnly) return;
    const status = getTableStatus(table);
    if (status === "available" || status === "selected") {
      if (selectedTable === table.tableNumber) {
        onTableSelect(null);
      } else {
        onTableSelect(table.tableNumber);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-500"></div>
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-600"></div>
          <span className="text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-300 border-2 border-red-400"></div>
          <span className="text-slate-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-gray-300"></div>
          <span className="text-slate-600">Too Small</span>
        </div>
      </div>

      {/* Table Map */}
      <div
        className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-300 overflow-hidden"
        style={{ width: "100%", height: mapHeight }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Restaurant entrance indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          Entrance
        </div>

        {/* Kitchen area */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-300 flex items-center justify-center text-slate-500 text-sm font-medium">
          Kitchen Area
        </div>

        {/* Tables */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          style={{ overflow: "visible" }}
        >
          {tables.map((table, index) => {
            const status = getTableStatus(table);
            const x = table.position?.x || 100 + (index % 4) * 120;
            const y = table.position?.y || 100 + Math.floor(index / 4) * 80;

            return (
              <g
                key={table._id || index}
                transform={`translate(${x}, ${y})`}
                onClick={() => handleTableClick(table)}
                onMouseEnter={() => setHoveredTable(table.tableNumber)}
                onMouseLeave={() => setHoveredTable(null)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  cursor:
                    status === "available" || status === "selected"
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {renderTableShape(table, status)}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold pointer-events-none"
                  style={{
                    fill: ["booked", "insufficient", "unavailable"].includes(
                      status,
                    )
                      ? "#64748b"
                      : "white",
                  }}
                >
                  {table.tableNumber}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip for hovered table */}
        {hoveredTable &&
          !readOnly &&
          tables.find((t) => t.tableNumber === hoveredTable) && (
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-3 text-sm z-10">
              {(() => {
                const table = tables.find(
                  (t) => t.tableNumber === hoveredTable,
                );
                const status = getTableStatus(table);
                return (
                  <>
                    <p className="font-bold">Table {table.tableNumber}</p>
                    <p className="text-slate-500">
                      Capacity: {table.capacity} guests
                    </p>
                    {status === "booked" && (
                      <p className="text-red-500">Already booked</p>
                    )}
                    {status === "insufficient" && (
                      <p className="text-gray-500">Too small for your party</p>
                    )}
                    {status === "available" && (
                      <p className="text-emerald-500">Click to select</p>
                    )}
                    {status === "selected" && (
                      <p className="text-indigo-500">
                        Selected - Click to deselect
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          )}
      </div>

      {/* Table List */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {tables.map((table) => {
          const status = getTableStatus(table);
          return (
            <button
              key={table._id || table.tableNumber}
              onClick={() => handleTableClick(table)}
              disabled={
                readOnly ||
                status === "booked" ||
                status === "insufficient" ||
                status === "unavailable"
              }
              className={`p-2 rounded-lg border-2 text-left transition-all ${
                status === "selected"
                  ? "border-indigo-500 bg-indigo-50"
                  : status === "booked"
                    ? "border-red-200 bg-red-50 opacity-50"
                    : status === "insufficient"
                      ? "border-gray-200 bg-gray-50 opacity-50"
                      : "border-slate-200 hover:border-emerald-300 bg-white"
              }`}
            >
              <p className="font-bold text-sm">Table {table.tableNumber}</p>
              <p className="text-xs text-slate-500">{table.capacity} guests</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableMap;
