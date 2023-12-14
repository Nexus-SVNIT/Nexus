import './App.css'
import { About, Events, Home, Layout, Teams, Forms } from './components'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/team' element={<Teams />} />
                    <Route path='/events' element={<Events />} />
                    <Route path='/forms' element={<Forms />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
