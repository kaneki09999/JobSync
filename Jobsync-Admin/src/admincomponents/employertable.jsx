import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { FaTrashAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';  
import Breadcrumbs from '../components/BreadCumbs';
import { postToEndpoint } from '../components/apiService';

const EmployerTable = () => {
  const navigate = useNavigate();  
  const [employers, setEmployer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchEmployer = async () => {
        try {
            const response = await postToEndpoint('/employerDetails.php');
            if (response.data.employers) {
                setEmployer(response.data.employers);
            } else {
                console.error('No employers found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching employers:', error);
        }
    };
    fetchEmployer();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
 
  const filteredData = React.useMemo(() => {
    return employers.filter((employer) => {
      return (
        `${employer.firstname} ${employer.middlename} ${employer.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employer.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employer.position?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, employers]);

  // **Pagination Logic**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = (index) => {
    setEmployer((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleRowClick = (rowData) => {
    navigate('/adminemployers/employerdetailspreview', { state: { employer: rowData } });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: React.useMemo(
      () => [
        {
          Header: 'Authorized Representative',  
          accessor: 'firstname',
          Cell: ({ row }) => `${row.original.firstname} ${row.original.middlename} ${row.original.lastname}`
        },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Designation', accessor: 'position' },
        { Header: 'Contact', accessor: 'contact' },
        { Header: 'Account Status', accessor: 'account_status' },
        {
          Header: 'Action',
          Cell: ({ row }) => (
            <button onClick={() => handleDelete(row.index)} className="btn btn-danger btn-sm">
              <FaTrashAlt />
            </button>
          ),
        },
      ],
      []
    ),
    data: currentData,   
  });

  return (
    <div className="container-fluid">
      <Breadcrumbs
        title="Authorized Representative"
        links={[
          { label: "Dashboard", href: "/admindashboard" },
          { label: "Authorized Representative", active: true },
        ]}
      />
      <p className="mb-4" style={{ textAlign: 'left' }}>
        The table below displays authorized representatives with their respective companies, and an action to delete their entries.
      </p>

      {/* Search Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '300px', marginBottom: '15px' }}
        />
      </div>

      {/* DataTable Example */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Authorized Representative Table</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" {...getTableProps()} width="100%" cellSpacing="0">
              <thead>
                {headerGroups.map((headerGroup, id) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={id}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tfoot>
                <tr>
                  <th>Authorized Representative</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Contact</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  const { key, ...rowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...rowProps} onClick={() => handleRowClick(row.original)} style={{ cursor: 'pointer' }}>
                      {row.cells.map((cell) => {
                        const { key, ...cellProps } = cell.getCellProps();
                        return <td key={key} {...cellProps}>{cell.render('Cell')}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerTable;
