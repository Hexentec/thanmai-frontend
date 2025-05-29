'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BulkRequestForm from '../components/BulkRequestForm';
import '../../styles/pages/BulkOrders.css';

export default function BulkOrdersPage() {
  return (
    <>
      
      <main className="bulk-orders-page">
        <h1>Bulk Orders</h1>
        <BulkRequestForm />
      </main>
      
    </>
  );
}
