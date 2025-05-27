import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImageProvider } from './contexts/ImageContext'
import { AuthProvider } from './contexts/AuthContext'
import { TextProvider } from './contexts/TextContext'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Story from './components/Story'
import Details from './components/Details'
import Gallery from './components/Gallery'
import GalleryWithLazyLoad from './components/Gallery/GalleryWithLazyLoad'
import HomepageGallery from './components/Gallery/HomepageGallery'
import SimpleHomepageGallery from './components/Gallery/SimpleHomepageGallery'

import GalleryPage from './components/Gallery/GalleryPage'
import Gifts from './components/Gifts'
import Gift from './components/Gift'
import MessageForm from './components/MessageForm'
import Footer from './components/Footer'
import Admin from './components/Admin'
import Video from './components/Video/Video'

function App() {
  const { t } = useTranslation();

  // Initialize AOS on component mount
  useEffect(() => {
    // This is a fallback in case the AOS initialization in main.jsx doesn't work
    if (window.AOS) {
      window.AOS.refresh()
    }
  }, [])

  // HomePage component that contains all sections except Gifts
  const HomePage = () => (
    <>
      <Hero />
      
      <div className="countdown-section">
        <Countdown />
      </div>
      
      <Story />
      
      <Details />
      
      <Video />
      
      <SimpleHomepageGallery />
      
      <MessageForm />
    </>
  );

  // Full Gallery Page component using our new GalleryPage component
  const FullGalleryPage = () => (
    <GalleryPage />
  );

  return (
    <AuthProvider>
      <ImageProvider>
        <TextProvider>
          <Router>
            <Navbar />
            
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/gift/:id" element={<Gift />} />
                <Route path="/gallery" element={<FullGalleryPage />} />
                <Route path="/contact" element={<MessageForm />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            
            <Footer />
          </Router>
        </TextProvider>
      </ImageProvider>
    </AuthProvider>
  )
}

export default App
