import React from 'react';
import NavBar from '../components/NavBar.jsx';
import Card from '../components/Card.jsx';

export default function LandingPage() {
  const events = [
    {
      eventName: 'Corporate Gala Night',
      createdBy:"john Wick",
      attendees: 120,
      rating: 5,
      category: 'Networking',
      location: 'New York, USA',
      description: 'An elegant evening of networking, dining, and entertainment for corporate professionals.',
      date: '2024-03-15',
      img: 'https://example.com/gala.jpg',
      
    },
    {
      eventName: 'Creative Arts Festival',
      attendees: 250,
      createdBy:"john Wick",

      rating: 4.8,
      category: 'Arts & Culture',
      location: 'Los Angeles, USA',
      description: 'A celebration of creativity featuring performances, exhibitions, and workshops.',
      date: '2024-02-28',
      img: 'https://example.com/arts.jpg',
      price: 300,
    },
    {
      eventName: 'Tech Conference 2024',
      attendees: 300,
      createdBy:"john Wick",

      rating: 4.2,
      category: 'Technology',
      location: 'San Francisco, USA',
      description: 'A premier event bringing together innovators, developers, and tech leaders.',
      date: '2024-03-20',
      img: 'https://example.com/tech.jpg',
      price: 1200,
    },
    {
      eventName: 'Luxury Wedding Expo',
      attendees: 180,
      createdBy:"john Wick",

      rating: 4.7,
      category: 'Wedding & Lifestyle',
      location: 'Miami, USA',
      description: 'An exclusive event showcasing wedding trends, vendors, and luxury experiences.',
      date: '2024-03-10',
      img: 'https://example.com/wedding.jpg',
      price: 800,
    },
    {
      eventName: 'Summer Music Festival',
      attendees: 400,
      createdBy:"john Wick",

      rating: 4.9,
      category: 'Music & Entertainment',
      location: 'Chicago, USA',
      description: 'A high-energy outdoor festival featuring top artists and live performances.',
      date: '2024-03-25',
      img: 'https://example.com/music.jpg',
      price: 1500,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {events.map((event, index) => (
            <div key={index} className="flex justify-center">
              <Card data={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
