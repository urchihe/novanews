import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, navbar }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {navbar}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {currentYear} Urchi.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
