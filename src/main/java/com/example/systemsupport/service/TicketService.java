package com.example.systemsupport.service;

import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * Creates a new ticket with status OPEN.
     */
    public Ticket createTicket(String query) {
        Ticket ticket = new Ticket();
        ticket.setQuery(query);
        ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    /**
     * Returns all tickets.
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Returns a ticket by its ID, or null if not found.
     */
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }
}
