package com.example.systemsupport.controller;

import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * POST /tickets
     * Request body: { "query": "..." }
     * Response: { "ticketId": ..., "aiResponse": "..." }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTicket(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Ticket ticket = new Ticket();
        String aiResponse = ticketService.createTicket(query, ticket);

        Map<String, Object> response = new HashMap<>();
        response.put("ticketId", ticket.getId());
        response.put("aiResponse", aiResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /tickets
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    /**
     * GET /tickets/{id}
     * Returns ticket details along with all linked messages.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }

        List<Message> messages = ticketService.getMessagesByTicketId(id);

        Map<String, Object> response = new HashMap<>();
        response.put("ticket", ticket);
        response.put("messages", messages);

        return ResponseEntity.ok(response);
    }
}
