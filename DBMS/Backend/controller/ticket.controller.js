const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

//to show user ticket price for event
const getTicketDetails=async (req,res) => {
    try {
        
    } catch (error) {
        console.error("Error completing purchase:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

const purchaseTicket=async (req,res) => {
    //buy a ticket, generate a new entry in ticket_purchases... should i involve payment gateway? 
    //*ATTENDEE ONLY*
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: errors.array() });
        }
    }catch{
        console.error("Error completing purchase:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }    
}

const getTicketsForUser=async (req,res) => {
    //attendee viewing their own tickets/ from ticket_purchases
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: errors.array() });
        }
    }catch{
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }  
}

const getTicketsForEvent=async (req,res) => {
    //*ORGANIZER ONLY* 
    //to view who attended their event
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: errors.array() });
        }
    }catch{
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }  
}




module.exports = {
    getTicketDetails,
    purchaseTicket,
    getTicketsForUser,
    getTicketsForEvent
  };