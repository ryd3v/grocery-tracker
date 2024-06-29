"use client"
import '../app/globals.css'
import {ReactNode} from 'react';
import useTheme from '../hooks/useTheme';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
    useTheme();

    return (<html className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <body>
        {children}
        </body>
        </html>
    );
}
