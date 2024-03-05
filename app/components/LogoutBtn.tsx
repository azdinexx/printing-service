import React from 'react';

function LogoutBtn() {
  const handlelogout = () => {
    const res = fetch('/account/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  };
  return (
    <button
      onClick={handlelogout}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm font-semibold"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
