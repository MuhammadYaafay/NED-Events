const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

const purchaseTicket=async (params) => {
    //buy a ticket, generate a new entry in ticket_purchases... should i involve payment gateway? 
    //*ATTENDEE ONLY*
}

const getTicketsForUser=async (params) => {
    //attendee viewing their own tickets
}

const getTicketsForEvent=async (params) => {
    //*ORGANIZER ONLY* 
    //to view who attended their event
}




module.exports = {
    purchaseTicket,
    getTicketsForUser,
    getTicketsForEvent
  };