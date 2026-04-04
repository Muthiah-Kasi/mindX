package com.example.systemsupport.service;

import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.repository.MessageRepository;
import com.example.systemsupport.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final MessageRepository messageRepository;
    private final AIService aiService;

    public TicketService(TicketRepository ticketRepository,
            MessageRepository messageRepository,
            AIService aiService) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.aiService = aiService;
    }

    /**
     * Creates a new ticket with status OPEN, saves the user message,
     * generates an AI response, and saves the AI message.
     *
     * @return the AI response string
     */
    @Transactional
    public String createTicket(String query, Ticket ticket) {
        // 1. Create ticket with smart escalation logic
        ticket.setQuery(query);

        String lowerQuery = query.toLowerCase();

        // Escalation: check for keywords that need human attention
        if (lowerQuery.contains("refund") || lowerQuery.contains("angry")) {
            ticket.setStatus("NEEDS_HUMAN");
            ticket.setPriority("HIGH");
        } else if (lowerQuery.contains("complaint")) {
            ticket.setStatus("NEEDS_HUMAN");
            ticket.setPriority("MEDIUM");
        } else {
            ticket.setStatus("OPEN");
            ticket.setPriority("LOW");
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // 2. Save USER message
        Message userMessage = new Message();
        userMessage.setTicketId(savedTicket.getId());
        userMessage.setSender("USER");
        userMessage.setMessage(query);
        messageRepository.save(userMessage);

        // 3. Generate AI response
        String aiResponse = aiService.generateResponse(query);

        // 4. Save AI message
        Message aiMessage = new Message();
        aiMessage.setTicketId(savedTicket.getId());
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        messageRepository.save(aiMessage);

        return aiResponse;
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

    /**
     * Returns all messages linked to a ticket.
     */
    public List<Message> getMessagesByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
    }

    /**
     * Updates the status of a ticket.
     */
    @Transactional
    public Ticket updateTicketStatus(Long id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return null;
        }
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}
