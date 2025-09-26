import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children, title }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;