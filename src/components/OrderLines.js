import { useEffect, useState, useCallback } from "react";

function OrderLines() {
  const [orderLines, setOrderLines] = useState([]);
  const [filteredOrderLines, setFilteredOrderLines] = useState([]);
  const [quantityFilter, setQuantityFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25); 
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedPackage, setSelectedPackage] = useState(1);

  useEffect(() => {
    fetchOrderLines();
  }, [pageNumber, selectedPackage]); 
  const fetchOrderLines = async () => {
    try {
      setIsLoading(true);
      const typeID = selectedPackage || 1; 
      const response = await fetch(
        `https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=${typeID}&page=${pageNumber}&pageSize=${pageSize}`
      );
      const data = await response.json();
      const sortedOrderLines = data.sort(
        (a, b) => a.OrderLineID - b.OrderLineID
      );
      setOrderLines(sortedOrderLines);
      setFilteredOrderLines(sortedOrderLines);
    } catch (error) {
      console.error("Error fetching order lines:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleQuantityFilterChange = (e) => {
    const { value } = e.target;
    setQuantityFilter(value);
    if (!value.trim()) {
      setFilteredOrderLines(orderLines);
      return;
    }
    const filtered = orderLines.filter(
      (orderLine) => orderLine.Quantity === parseInt(value)
    );
    setFilteredOrderLines(filtered);
  };

  const handlePageChange = useCallback((pageNumber) => {
    setPageNumber(pageNumber);
  }, []); // No dependencies, so this function won't change between renders

  // Calculate pagination indexes
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = pageNumber * pageSize;

  // Slice the order lines array to display only the current page
  const currentOrderLines = filteredOrderLines.slice(startIndex, endIndex);
  const handlePackageSelect = (selectedPackage) => {
    console.log(selectedPackage);
    setSelectedPackage(selectedPackage);
  };
  const packageColorMap = {
    1: "bg-blue-200",
    2: "bg-green-200",
    3: "bg-yellow-200",
    4: "bg-red-200",
    5: "bg-purple-200",
    6: "bg-indigo-200",
    7: "bg-pink-200",
    8: "bg-teal-200",
    9: "bg-orange-200",
    10: "bg-blue-400",
    11: "bg-green-400",
    12: "bg-yellow-400",
    13: "bg-red-400",
    14: "bg-purple-400",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Minizuba Order Lines</h1>
      <div className="flex gap-2">
        <div>
          {" "}
          <label htmlFor="quantity-filter" className="block mb-2">
            Filter by Quantity:
          </label>
          <input
            type="number"
            id="quantity-filter"
            placeholder="Enter quantity..."
            value={quantityFilter}
            onChange={handleQuantityFilterChange}
            className="border rounded py-1 px-2 mb-2"
          />
        </div>
        <div>
          {" "}
          <label htmlFor="package-select" className="block mb-2">
            Select Package:
          </label>
          <select
            id="package-select"
            value={selectedPackage}
            onChange={(e) => handlePackageSelect(e.target.value)}
            className="border rounded py-1 px-2 mb-4"
          >
            <option value="">All Packages</option>
            {[...Array(14).keys()].map((_, index) => (
              <option
                key={index + 1}
                value={index + 1}
                className={`${packageColorMap[index + 1]}`}
              >
                Package {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead
              className={`border-t ${
                packageColorMap[selectedPackage] || packageColorMap[1]
              }`}
            >
              <tr>
                <th className="px-4 py-2">OrderLineID</th>
                <th className="px-4 py-2">OrderID</th>
                <th className="px-4 py-2">StockItemID</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">PackageTypeID</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">UnitPrice</th>
              </tr>
            </thead>
            <tbody>
              {currentOrderLines.map((orderLine) => (
                <tr
                  key={orderLine.OrderLineID}
                  className={`border-t ${
                    packageColorMap[orderLine.PackageTypeID]
                  }`}
                >
                  <td className="px-4 py-2">{orderLine.OrderLineID}</td>
                  <td className="px-4 py-2">{orderLine.OrderID}</td>
                  <td className="px-4 py-2">{orderLine.StockItemID}</td>
                  <td className="px-4 py-2">{orderLine.Description}</td>
                  <td className="px-4 py-2">{orderLine.PackageTypeID}</td>
                  <td className="px-4 py-2">{orderLine.Quantity}</td>
                  <td className="px-4 py-2">{orderLine.UnitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Previous Page
        </button>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={endIndex >= filteredOrderLines.length}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default OrderLines;
