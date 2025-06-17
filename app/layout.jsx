// app/layout.jsx
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';  
import { AuthProvider } from './context/AuthContext';
import CartSidebar from './components/CartSidebar';

export const metadata = {
  title: 'Thanmai Home Foods',
  description: 'Online Pickle store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>                         
            <Navbar />
            <main className="container">
              {children}
            </main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
