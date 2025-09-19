import Header from './Header';
import Footer from './Footer';
import StickyFooter from './StickyFooter';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onRegisterClick?: () => void;
  isPopupOpen?: boolean;
}

export default function Layout({ children, onRegisterClick, isPopupOpen }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onRegisterClick={onRegisterClick} />
      <main className="flex-grow pt-20 pb-20">
        {children}
      </main>
      <Footer />
      <StickyFooter onRegisterClick={onRegisterClick} isPopupOpen={isPopupOpen} />
    </div>
  );
}