import React from "react";
import Table from "components/ui/Table";

const MyComponent = () => {
  const data = [
    { name: "John Doe", age: 30 },
    { name: "Jane Smith", age: 25 },
  ];

  return (
    <div>
      <h1>My Data Table</h1>
      <Table data={data} />
    </div>
  );
};

export default MyComponent;
