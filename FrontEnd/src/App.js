import logo from './logo.svg';
import Header from './components/header/Header';
import SumaryHeader from './components/sumaryCourse/SumaryHeader';
import Footer from './components/footer/Footer';
import HomePage from './components/HomePage/HomePage';
import Card from './components/common/Card/Card';
import PopupCard from './components/common/Card/PopupCard';
function App() {
  
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '10%' }}>
        {/* <SumaryHeader/> */}
        <HomePage />
        
      </div>
      <Footer />
    </div>
  );
}

export default App;