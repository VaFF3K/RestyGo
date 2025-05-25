import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ClientNavbar from '../layout/ClientNavbar';
import AdminNavbar from '../layout/AdminNavbar';
import CookNavbar from '../layout/CookNavbar';

function Layout() {
    const location = useLocation();
    const { pathname } = location;

    const hideNavbar = pathname === '/auth';
    const isAdmin = pathname.startsWith('/admin');
    const isCook = pathname.startsWith('/cook');

    return (
        <>
            {!hideNavbar && (
                <>
                    {isAdmin ? (
                        <AdminNavbar />
                    ) : isCook ? (
                        <CookNavbar />
                    ) : (
                        <ClientNavbar />
                    )}
                </>
            )}
            <main style={{ paddingTop: hideNavbar ? 0 : '15px' }}>
                <Outlet />
            </main>
            <footer className="footer">
                <p>© {new Date().getFullYear()} RestyGO</p>
            </footer>
        </>
    );
}

export default Layout;