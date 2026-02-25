import { useState } from "react";
import toast from "react-hot-toast";

const TableLayoutEditor = ({ tables = [], onSave }) => {
  const [localTables, setLocalTables] = useState(tables);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const mapWidth = 600;
  const mapHeight = 350;

  const defaultPositions = [
    { x: 80, y: 80 },
    { x: 200, y: 80 },
    { x: 320, y: 80 },
    { x: 440, y: 80 },
    { x: 80, y: 180 },
    { x: 200, y: 180 },
    { x: 320, y: 180 },
    { x: 440, y: 180 },
    { x: 80, y: 280 },
    { x: 200, y: 280 },
    { x: 320, y: 280 },
    { x: 440, y: 280 },
  ];

  const addTable = () => {
    const tableNumber = localTables.length + 1;
    const position = defaultPositions[localTables.length] || {
      x: 100 + (localTables.length % 4) * 120,
      y: 100 + Math.floor(localTables.length / 4) * 100,
    };

    const newTable = {
      tableNumber,
      capacity: 4,
      isAvailable: true,
      position,
    };

    setLocalTables([...localTables, newTable]);
    toast.success(`Table ${tableNumber} added!`);
  };

  const removeTable = (tableNumber) => {
    setLocalTables(localTables.filter((t) => t.tableNumber !== tableNumber));
    // Renumber remaining tables
    const renumbered = localTables
      .filter((t) => t.tableNumber !== tableNumber)
      .map((t, index) => ({
        ...t,
        tableNumber: index + 1,
        position: defaultPositions[index] || t.position,
      }));
    setLocalTables(renumbered);
    if (selectedTableId === tableNumber) {
      setSelectedTableId(null);
    }
    toast.success(`Table ${tableNumber} removed!`);
  };

  const updateTable = (tableNumber, field, value) => {
    setLocalTables(
      localTables.map((t) =>
        t.tableNumber === tableNumber ? { ...t, [field]: value } : t,
      ),
    );
  };

  const handleDragStart = (e, tableNumber) => {
    setSelectedTableId(tableNumber);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e) => {
    if (isDragging || !selectedTableId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale to SVG coordinates
    const scaleX = mapWidth / rect.width;
    const scaleY = mapHeight / rect.height;

    const scaledX = Math.max(40, Math.min(mapWidth - 40, x * scaleX));
    const scaledY = Math.max(60, Math.min(mapHeight - 60, y * scaleY));

    setLocalTables(
      localTables.map((t) =>
        t.tableNumber === selectedTableId
          ? { ...t, position: { x: scaledX, y: scaledY } }
          : t,
      ),
    );
  };

  const selectedTable = localTables.find(
    (t) => t.tableNumber === selectedTableId,
  );

  const renderTableShape = (table, isSelected) => {
    const size = Math.min(40 + table.capacity * 8, 90);
    const isLarge = table.capacity > 6;
    const fillColor = isSelected
      ? "fill-indigo-500"
      : table.isAvailable
        ? "fill-emerald-400"
        : "fill-gray-300";
    const strokeColor = isSelected
      ? "stroke-indigo-600"
      : table.isAvailable
        ? "stroke-emerald-500"
        : "stroke-gray-400";

    if (isLarge) {
      return (
        <ellipse
          cx="50%"
          cy="50%"
          rx={size / 2}
          ry={size / 3}
          className={`${fillColor} ${strokeColor} stroke-[3] transition-all`}
        />
      );
    }

    return (
      <circle
        r={size / 2}
        className={`${fillColor} ${strokeColor} stroke-[3] transition-all`}
      />
    );
  };

  const handleSave = () => {
    onSave(localTables);
    toast.success("Table layout saved!");
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          How to set up your table layout:
        </h4>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• Click "Add Table" to add new tables</li>
          <li>
            • Click on a table to select it, then click on the map to position
            it
          </li>
          <li>
            • Use the form on the right to change table capacity and
            availability
          </li>
          <li>• Click "Remove" to delete a selected table</li>
        </ul>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map Editor */}
        <div className="flex-1">
          <div
            className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-300 overflow-hidden cursor-crosshair"
            style={{ height: mapHeight }}
            onClick={handleMapClick}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #94a3b8 1px, transparent 1px),
                  linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            ></div>

            {/* Entrance */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium pointer-events-none">
              Entrance
            </div>

            {/* Kitchen */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-300 flex items-center justify-center text-slate-500 text-sm font-medium pointer-events-none">
              Kitchen Area
            </div>

            {/* Tables */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            >
              {localTables.map((table) => (
                <g
                  key={table.tableNumber}
                  transform={`translate(${table.position?.x || 100}, ${table.position?.y || 100})`}
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTableId(table.tableNumber);
                  }}
                >
                  {renderTableShape(
                    table,
                    selectedTableId === table.tableNumber,
                  )}
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold pointer-events-none"
                    style={{ fill: "white" }}
                  >
                    {table.tableNumber}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={addTable}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Table
            </button>
            <button
              onClick={() => selectedTableId && removeTable(selectedTableId)}
              disabled={!selectedTableId}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove Selected
            </button>
          </div>
        </div>

        {/* Table Properties */}
        <div className="w-full lg:w-72 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4">
            {selectedTable
              ? `Table ${selectedTable.tableNumber} Properties`
              : "Select a Table"}
          </h3>

          {selectedTable ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  value={selectedTable.tableNumber}
                  onChange={(e) =>
                    updateTable(
                      selectedTable.tableNumber,
                      "tableNumber",
                      parseInt(e.target.value),
                    )
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Capacity (guests)
                </label>
                <select
                  value={selectedTable.capacity}
                  onChange={(e) =>
                    updateTable(
                      selectedTable.tableNumber,
                      "capacity",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} guests
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Available
                </label>
                <button
                  onClick={() =>
                    updateTable(
                      selectedTable.tableNumber,
                      "isAvailable",
                      !selectedTable.isAvailable,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    selectedTable.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedTable.isAvailable
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Click on the map to position this table where you want it.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              Click on a table in the map to edit its properties.
            </p>
          )}
        </div>
      </div>

      {/* Table List Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-4">
          All Tables ({localTables.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {localTables.map((table) => (
            <button
              key={table.tableNumber}
              onClick={() => setSelectedTableId(table.tableNumber)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                selectedTableId === table.tableNumber
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              <p className="font-bold text-lg">T{table.tableNumber}</p>
              <p className="text-xs text-slate-500">{table.capacity} guests</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                  table.isAvailable
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {table.isAvailable ? "Available" : "Unavailable"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30"
      >
        Save Table Layout
      </button>
    </div>
  );
};

export default TableLayoutEditor;
