const Breadcrumbs = ({ title, links }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0, fontSize: '16px', margin: 0 }}>
            {links.map((link, index) => (
              <li key={index} className={`breadcrumb-item ${link.active ? 'active' : ''}`} aria-current={link.active ? 'page' : undefined}>
                {link.active ? (
                  link.label
                ) : (
                  <a href={link.href} style={{ color: '#007bff', textDecoration: 'none' }}>{link.label}</a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  };
  
  export default Breadcrumbs;
  