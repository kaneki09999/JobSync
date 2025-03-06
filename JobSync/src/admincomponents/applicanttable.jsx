import React from 'react';
import { useTable } from 'react-table';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminApplicantTable = () => {
  const navigate = useNavigate();

  // Sample data for applicants
  const initialData = React.useMemo(
    () => [
      {
        name: 'John Doe',
        appliedPosition: 'Software Engineer',
        skills: 'JavaScript, React, Node.js',
        contact: '+1234567890',
        email: 'johndoe@example.com',
        dob: '1990-01-01',
        nationality: 'American',
        gender: 'Male',
        maritalStatus: 'Single',
        experience: '3 years',
        education: 'B.Sc. Computer Science',
        idFront: 'path/to/front-id.jpg', // Example URL
        idBack: 'path/to/back-id.jpg',   // Example URL
        resume: 'johndoe_resume.pdf',    // Example document
      },
      {
        name: 'Jane Smith',
        appliedPosition: 'Frontend Developer',
        skills: 'HTML, CSS, JavaScript, Angular',
        contact: '+0987654321',
        email: 'janesmith@example.com',
        dob: '1992-05-15',
        nationality: 'Canadian',
        gender: 'Female',
        maritalStatus: 'Married',
        experience: '2 years',
        education: 'B.A. Design',
        idFront: 'path/to/front-id2.jpg', // Example URL
        idBack: 'path/to/back-id2.jpg',   // Example URL
        resume: 'janesmith_resume.pdf',   // Example document
      },
      // Add more sample data as needed
    ],
    []
  );

  const [applicantData, setApplicantData] = React.useState(initialData);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter data based on the search query
  const filteredData = React.useMemo(() => {
    return applicantData.filter((applicant) => {
      return (
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.appliedPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.skills.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, applicantData]);

  // Columns configuration
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Applied Position',
        accessor: 'appliedPosition',
      },
      {
        Header: 'Skills',
        accessor: 'skills',
      },
      {
        Header: 'Action',
        // Define a custom cell for the Action column with a delete button
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
    setApplicantData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Use the useTable hook to create the table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredData, // Use filtered data here
  });

  // Handle row click to navigate to the applicant preview page
  const handleRowClick = (rowData) => {
    navigate('/adminapplicants/applicantdetailspreview', {
      state: { applicant: rowData },
    });
  };

  return (
    <div className="container-fluid">
      <h1 className="h3">Applicants</h1>
      <p>
        The table below displays applicants with their respective applied positions, skills, and action to delete their entries.
      </p>

      {/* Search Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search applicants by name, position, or skills"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Applicants Table</h6>
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
                  <th>Name</th>
                  <th>Applied Position</th>
                  <th>Skills</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      onClick={() => handleRowClick(row.original)} 
                      style={{ cursor: 'pointer' }} 
                    >
                      {row.cells.map((cell) => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                      })}
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

export default AdminApplicantTable;
