import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountdown from 'react-countdown';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { pt, es, enUS } from 'date-fns/locale';
import './Countdown.scss';

const Countdown = () => {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Wedding date: March 6, 2025 at 17:00 Thailand time (GMT+7)
  // Thailand timezone is 'Asia/Bangkok'
  const weddingDate = new Date('2025-03-06T17:00:00+07:00');
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get locale based on current language
  const getLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return pt;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };
  
  // Format the wedding date based on current language
  const formattedWeddingDate = () => {
    const locale = getLocale();
    return format(weddingDate, 'PPPp', { locale });
  };
  
  // Get time remaining in human readable format
  const timeRemaining = () => {
    return formatDistanceToNow(weddingDate, { 
      locale: getLocale(),
      addSuffix: true 
    });
  };
  
  // Get current time in Thailand
  const thailandTime = () => {
    return formatInTimeZone(currentTime, 'Asia/Bangkok', 'HH:mm:ss');
  };

  // Renderer for the countdown
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    // Format numbers to always have two digits
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    if (completed) {
      // If the countdown is complete, show a message
      return (
        <div className="text-center celebration-message">
          <h2>{t('countdown.completed')}</h2>
          <p>{t('countdown.celebration')}</p>
          <div className="celebration-animation">
            <i className="fas fa-heart fa-beat-fade fa-3x"></i>
          </div>
        </div>
      );
    } else {
      // Otherwise, render the countdown
      return (
        <>
          <div className="simple-countdown" data-aos="fade-up">
            <div className="countdown-timer">
              <div className="countdown-unit">
                <span className="countdown-number">{formattedDays}</span>
                <span className="countdown-label">{t('countdown.days')}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-unit">
                <span className="countdown-number">{formattedHours}</span>
                <span className="countdown-label">{t('countdown.hours')}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-unit">
                <span className="countdown-number">{formattedMinutes}</span>
                <span className="countdown-label">{t('countdown.minutes')}</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-unit">
                <span className="countdown-number">{formattedSeconds}</span>
                <span className="countdown-label">{t('countdown.seconds')}</span>
              </div>
            </div>
          </div>
          
        </>
      );
    }
  };

  return (
    <div className="container">
      <div className="countdown">
        <h3 className="text-center mb-4" data-aos="fade-up">{t('countdown.title')}</h3>
        <ReactCountdown
          date={weddingDate}
          renderer={renderer}
        />
      </div>
    </div>
  );
};

export default Countdown; 