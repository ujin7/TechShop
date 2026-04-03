import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import ClientLayout from '@/components/layout/ClientLayout';
import { categories } from '@/data/categories';

export const metadata = {
  title: 'TechShop | Premium IT Devices',
  description: 'Compare and shop smartphones, laptops, tablets, monitors, audio, and accessories in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <CompareProvider>
                <ClientLayout categories={categories}>{children}</ClientLayout>
              </CompareProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
