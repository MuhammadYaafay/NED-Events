import React from "react";
import NavBar from "../components/NavBar.jsx";
import Card from "../components/Card.jsx";

export default function LandingPage() {
  const events = [
    {
      eventName: "Corporate Gala Night",
      createdBy: "john ",
      attendees: 120,
      rating: 5,
      category: "Networking",
      location: "New York, USA",
      description:
        "An elegant evening of networking, dining, and entertainment for corporate professionals.",
      date: "2024-03-15",
      img: "https://media.licdn.com/dms/image/v2/C561BAQE-51J-8KkMZg/company-background_10000/company-background_10000/0/1584559866970/eventscom_cover?e=2147483647&v=beta&t=3bktbE7ts5aNwH8XEUM5rW0G2aMbuQ1b2dHBVQgZqmA",
    },
    {
      eventName: "Creative Arts Festival",
      attendees: 250,
      createdBy: "jessie",

      rating: 4.8,
      category: "Arts & Culture",
      location: "Los Angeles, USA",
      description:
        "A celebration of creativity featuring performances, exhibitions, and workshops.",
      date: "2024-02-28",
      img: "https://eventphotos.com.au/2022/wp-content/uploads/corporate-event-photography-800x530.webp",
      price: 300,
    },
    {
      eventName: "Tech Conference 2024",
      attendees: 300,
      createdBy: "Walter",
      rating: 4.2,
      category: "Technology",
      location: "San Francisco, USA",
      description:
        "A premier event bringing together innovators, developers, and tech leaders.",
      date: "2024-03-20",
      img: "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
      price: 1200,
    },
    {
      eventName: "Luxury Wedding Expo",
      attendees: 180,
      createdBy: "Haider",

      rating: 4.7,
      category: "Wedding & Lifestyle",
      location: "Miami, USA",
      description:
        "An exclusive event showcasing wedding trends, vendors, and luxury experiences.",
      date: "2024-03-10",
      img: "https://cdn.prod.website-files.com/61f29c609f84a86e418fbcfb/63ecdf6e6df724eab1f0e8ca_20230215T0132-25bece5c-5ab8-4c33-98c7-60ad2668054b.webp",
      price: 800,
    },
    {
      eventName: "Summer Music Festival",
      attendees: 400,
      createdBy: "kaif",

      rating: 4.9,
      category: "Music & Entertainment",
      location: "Chicago, USA",
      description:
        "A high-energy outdoor festival featuring top artists and live performances.",
      date: "2024-03-25",
      img: "https://wallpapers.com/images/featured/corporate-event-g6myc8i808y8llhh.jpg",
      price: 1500,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Upcoming Events
        </h1>
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
