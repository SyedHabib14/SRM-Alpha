import React from 'react';

const TestNavbar = () => {
  return (
    <div className="navbar bg-base-100 dark:bg-base-900">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl text-black dark:text-white">Test Navbar</a>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
};

export default TestNavbar;
