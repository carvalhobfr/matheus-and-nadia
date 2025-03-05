import React from "react";
import { useTranslation } from "react-i18next";
import './Story.scss';

const Story = () => {
  const { t } = useTranslation();

  const storyEvents = [
    {
      key: "firstMeet",
      date: "2010"
    },
    {
      key: "firstDate",
      date: "2015"
    },
    {
      key: "livingTogether",
      date: "2017"
    },
    {
      key: "proposal",
      date: "2021"
    },
    {
      key: "civilWedding",
      date: "2024"
    }
  ];

  return (
    <section id="story" className="story-section">
      <div className="container">
        <h2 className="section-title">{t("story.title")}</h2>
        <p className="section-subtitle">{t("story.subtitle")}</p>
        
        <div className="timeline">
          {storyEvents.map((event, index) => (
            <div key={event.key} className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}>
              <div className="timeline-content">
                <div className="date">{event.date}</div>
                <h3>{t(`story.${event.key}.title`)}</h3>
                <p>{t(`story.${event.key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Story; 