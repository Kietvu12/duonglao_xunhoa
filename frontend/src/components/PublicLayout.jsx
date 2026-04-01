import Navbar from './Navbar';
import Footer from './Footer';
import ContactFloatingButtons from './ContactFloatingButtons';

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ContactFloatingButtons />
    </>
  );
};

export default PublicLayout;
