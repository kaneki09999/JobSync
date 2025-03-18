import React from "react";
import "../css/MyNavbar.css";
import { Container } from "react-bootstrap";

export default function Header({ pageTitle, breadcrumbs }) {
  return (
    <>
      <header 
        className="py-3 fixed-top head d-flex align-items-center justify-content-between"
        style={{ 
          marginTop: "131px", 
          background: "linear-gradient(62deg, rgba(41,108,182,1) 0%, rgba(40,118,185,1) 51%, rgba(23,96,184,1) 98%)", 
          zIndex: 999, 
          width: "100%", 
        }}
      >
        <Container className="d-flex align-items-center justify-content-between">
          {/* Page Title */}
          <h1 
            className="mb-0 flex-grow-1 text-start text-truncate header-title"
          >
            {pageTitle}
          </h1>

          {/* Breadcrumbs Navigation */}
          <nav>
            <ol className="breadcrumb mb-0 p-0 bg-transparent">
              {breadcrumbs.map((crumb, index) => (
                <li 
                  key={index} 
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? "active" : ""} breadcrumb-item-text`}
                >
                  {index === breadcrumbs.length - 1 ? (
                    crumb.label
                  ) : (
                    <a href={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </header>

      <style>{`
      /* Default Desktop Styles */
      .header-title {
        font-size: 16px; 
        color: #ffffffff;
      }
      .breadcrumb-item.active {
        font-size: 14px; 
        color: white;
      }
      
      .breadcrumb-item-text {
        font-size: 14px; 
      }
      
      .breadcrumb-link {
        color: white;
        white-space: nowrap;
      }

      /* Adjust Header Padding */
      .head {
        padding-left: 10%;
        padding-right: 10%;
      }
      
      /* Mobile View (Up to 768px) */
      @media (max-width: 768px) {
        .header-title {
          font-size: 14px; 
        }
      
        .breadcrumb-item-text {
          font-size: 12px;
        }
      
        .breadcrumb-link {
          font-size: 12px;
        }

        .head {
          padding-left: 5%;
          padding-right: 5%;
        }
      }
      
      /* Smaller Mobile View (Up to 576px) */
      @media (max-width: 576px) {
        .header-title {
          font-size: 13px; 
        }
      
        .breadcrumb-item-text {
          font-size: 11px;
        }
      
        .breadcrumb-link {
          font-size: 11px;
        }

        .head {
          padding-left: 3%;
          padding-right: 3%;
        }
      }
      `}</style>
    </>
  );
}
