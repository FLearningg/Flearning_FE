import logo from './logo.svg';
import Header from './components/header/Header';
import SumaryHeader from './components/sumaryCourse/SumaryHeader';
import Footer from './components/footer/Footer';
function App() {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '10%' }}>
        <SumaryHeader/>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;