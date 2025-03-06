import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/BreadCumbs';
import { postToEndpoint } from '../components/apiService';

const AdminApplicantTable = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await postToEndpoint('/findApplicant.php');
        if (response.data.applicants) {
          setApplicants(response.data.applicants);
        } else {
          console.error('No applicants found or an error occurred:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };
    fetchApplicants();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter applicants based on search query
  const filteredData = React.useMemo(() => {
    return applicants.filter((applicant) =>
      (`${applicant.firstname} ${applicant.middlename} ${applicant.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (applicant.appliedPosition?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (applicant.skills?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, applicants]);

  // **Pagination Logic**
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (index) => {
    setApplicants((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleRowClick = (rowData) => {
    navigate('/adminapplicants/applicantdetailspreview', { state: { applicant: rowData } });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'firstname',
          Cell: ({ row }) => `${row.original.firstname} ${row.original.middlename} ${row.original.lastname}`
        },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Contact', accessor: 'contact' },
        { Header: 'Attainment', accessor: 'attainment' },
        {
          Header: 'Date of Birth',
          accessor: 'birthday',
          Cell: ({ value }) => {
            if (!value) return '';
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          }
        },
        { Header: 'City', accessor: 'city' },
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
    data: currentData, // Display paginated data
  });

  return (
    <div className="container-fluid">
      <Breadcrumbs
        title="Applicants"
        links={[
          { label: "Dashboard", href: "/admindashboard" },
          { label: "Applicants", active: true },
        ]}
      />
      <p style={{ textAlign: 'left' }}>
        The table below displays applicants with their names, email, contact, and action to delete their entries.
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

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Applicants Table</h6>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Attainment</th>
                  <th>Date of Birth</th>
                  <th>City</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id} onClick={() => handleRowClick(row.original)} style={{ cursor: 'pointer' }}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                      ))}
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

export default AdminApplicantTable;
