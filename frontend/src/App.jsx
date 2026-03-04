import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

const App = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
       <Outlet/>
      </main>
      <Footer />
    </div>  
  )
}

export default App