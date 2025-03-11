import React from 'react';
import NavBar from '../components/NavBar.jsx';
import EventCard from '../components/EventCard.jsx';

export default function LandingPage() {
  const data = [
    // This is a demo data. this data would be fetched from DB
    {
      username: 'adil',
      headCount: 12,
      review: 4.5,
      isPublic: true,
      intro: 'Event planner with a passion for memorable experiences.',
      desp: 'Adil specializes in organizing corporate and social events with a focus on hospitality.',
      date: '2024-03-15',
      img: '',
    },
    {
      username: 'sara',
      headCount: 25,
      review: 4.8,
      isPublic: false,
      intro: 'Creative designer and event organizer.',
      desp: 'Sara curates themed events with stunning aesthetics and seamless execution.',
      date: '2024-02-28',
      img: 'https://example.com/image3.jpg',
    },
    {
      username: 'john',
      headCount: 30,
      review: 4.2,
      isPublic: true,
      intro: 'Expert in large-scale conferences and corporate retreats.',
      desp: 'John has years of experience managing high-profile corporate gatherings with precision.',
      date: '2024-03-20',
      img: 'https://example.com/image5.jpg',
    },
    {
      username: 'emma',
      headCount: 18,
      review: 4.7,
      isPublic: false,
      intro: 'Wedding and private event specialist.',
      desp: 'Emma brings creativity and elegance to weddings and special occasions.',
      date: '2024-03-10',
      img: 'https://example.com/image7.jpg',
    },
    {
      username: 'mike',
      headCount: 40,
      review: 4.9,
      isPublic: true,
      intro: 'Concert and festival organizer.',
      desp: 'Mike manages large-scale entertainment events, ensuring unforgettable experiences.',
      date: '2024-03-25',
      img: 'https://example.com/image9.jpg',
    },
  ];

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((e, index) => (
            <EventCard key={index} data={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
