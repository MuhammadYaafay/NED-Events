
// Mock vendor data
export const vendorData = {
  name: "Tech Gadgets Co.",
  email: "contact@techgadgets.com",
  phone: "+1 (555) 123-4567",
  logo: "https://github.com/shadcn.png",
  description: "We provide the latest tech gadgets and accessories for events and conferences.",
  products: [
    { id: 1, name: "Wireless Charger", price: "$25.99", image: "https://placehold.co/300x200" },
    { id: 2, name: "Bluetooth Speaker", price: "$49.99", image: "https://placehold.co/300x200" },
    { id: 3, name: "Phone Stand", price: "$15.99", image: "https://placehold.co/300x200" }
  ],
  events: [
    { id: 1, name: "Tech Conference 2023", status: "approved", date: "Oct 15, 2023" },
    { id: 2, name: "Digital Summit", status: "pending", date: "Nov 20, 2023" },
    { id: 3, name: "DevCon West", status: "rejected", date: "Dec 5, 2023" }
  ],
  requestHistory: [
    { 
      id: 1, 
      eventName: "Tech Conference 2023", 
      requestDate: "Sep 10, 2023", 
      status: "approved", 
      responseDate: "Sep 15, 2023",
      fee: "$250.00"
    },
    { 
      id: 2, 
      eventName: "Digital Summit", 
      requestDate: "Oct 20, 2023", 
      status: "pending", 
      responseDate: "-",
      fee: "$300.00"
    },
    { 
      id: 3, 
      eventName: "DevCon West", 
      requestDate: "Nov 01, 2023", 
      status: "rejected", 
      responseDate: "Nov 05, 2023",
      fee: "$200.00"
    },
    { 
      id: 4, 
      eventName: "Mobile Expo 2024", 
      requestDate: "Dec 10, 2023", 
      status: "approved", 
      responseDate: "Dec 15, 2023",
      fee: "$350.00"
    }
  ]
};
