// Employers.js
import React from 'react';
import AdminSidebar from '../../components/adminsidebar';
import EmployerTable from '../../admincomponents/employertable';
import AdminHeader from '../../admincomponents/adminheader';  

const username = "AdminUser";

export default function AdminEmployers() {
  return (

    
    <div className="d-flex" style={{ height: "100vh", flexDirection: "row" }}>
      <style>
        {`

         body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            display: flex;
         
          }


          #root {
              position: fixed;
              top: 0;
              right: 0;
              margin: 0;
              left: -32px;
              min-width: 100%;
          }
         .container-fluid {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: relative;
        }
          
        `}
      </style>
      {/* Include Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "transparent" }}>
        {/* Include Header */}
        <AdminHeader username={username} />

        {/* Employer Table */}
        <EmployerTable />
      </div>
    </div>
  );
}
