import logo from './logo.svg';
import Header from './components/header/Header';
import SumaryHeader from './components/sumaryCourse/SumaryHeader';
import Footer from './components/footer/Footer';
import HomePage from './components/HomePage/HomePage';
import Card from './components/common/Card/Card';
import PopupCard from './components/common/Card/PopupCard';
import AboutUs from './components/AboutPage/AboutUs';
import ContactUs from './components/Contact/ContactUs';
function App() {
  
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '9%' }}>
        {/* <SumaryHeader/> */}
        {/* <HomePage /> */}
        {/* <AboutUs/> */}
        <ContactUs/>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;