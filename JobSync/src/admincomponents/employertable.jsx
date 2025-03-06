import React from 'react';
import { useTable } from 'react-table';
import { FaTrashAlt } from 'react-icons/fa'; // Importing trash icon from react-icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EmployerTable = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Sample data for authorized representatives and their respective companies
  const initialData = React.useMemo(
    () => [
      {
        name: 'John Doe',  // Changed from representative to name
        company: 'Tech Innovators Ltd.',
        position: 'CEO',   // Added position field
        contact: '123-456-7890',  // Added contact field
        email: 'john.doe@example.com',  // Added email field
        idFront: 'path/to/front-id.jpg', // Added ID images
        idBack: 'path/to/back-id.jpg',
      },
      {
        name: 'Jane Smith',
        company: 'Creative Solutions Inc.',
        position: 'CTO',
        contact: '987-654-3210',
        email: 'jane.smith@example.com',
        idFront: 'path/to/front-id2.jpg',
        idBack: 'path/to/back-id2.jpg',
      },
      // Additional entries...
    ],
    []
  );

  const [representativeData, setRepresentativeData] = React.useState(initialData);

  // Columns configuration
  const columns = React.useMemo(
    () => [
      {
        Header: 'Employer Name',  // Renamed from Authorized Representative to Employer Name
        accessor: 'name',         // Changed from 'representative' to 'name'
      },
      {
        Header: 'Company',
        accessor: 'company',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.index)}
            className="btn btn-danger btn-sm"
          >
            <FaTrashAlt />
          </button>
        ),
      },
    ],
    []
  );

  // Delete handler function
  const handleDelete = (index) => {
    setRepresentativeData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Handle row click to navigate to another page and pass data via state
  const handleRowClick = (rowData) => {
    navigate('/adminemployers/employerdetailspreview', { state: { employer: rowData } });
  };

  // Use the useTable hook to create the table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: representativeData,
  });

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Employers Table</h1>
      <p className="mb-4">
        The table below displays authorized representatives with their respective companies, and an action to delete their entries.
      </p>

      {/* DataTable Example */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Employers Table</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" {...getTableProps()} width="100%" cellspacing="0">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tfoot>
                <tr>
                  <th>Employer Name</th>
                  <th>Company</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      onClick={() => handleRowClick(row.original)} // Row click to navigate
                      style={{ cursor: 'pointer' }} // Make it look clickable
                    >
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerTable;
