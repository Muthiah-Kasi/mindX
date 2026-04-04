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
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Query cannot be empty");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Ticket ticket = new Ticket();

            // Link ticket to user if userId is provided
            String userIdStr = request.get("userId");
            if (userIdStr != null && !userIdStr.isBlank()) {
                try {
                    ticket.setUserId(Long.parseLong(userIdStr));
                } catch (NumberFormatException ignored) {
                    // Ignore invalid userId, keep it null
                }
            }

            String aiResponse = ticketService.createTicket(query, ticket);

            Map<String, Object> response = new HashMap<>();
            response.put("ticketId", ticket.getId());
            response.put("aiResponse", aiResponse);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /tickets
     */
    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        try {
            return ResponseEntity.ok(ticketService.getAllTickets());
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /tickets/{id}
     * Returns ticket details along with all linked messages.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            List<Message> messages = ticketService.getMessagesByTicketId(id);

            Map<String, Object> response = new HashMap<>();
            response.put("ticket", ticket);
            response.put("messages", messages);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * PUT /tickets/{id}/status
     * Request body: { "status": "OPEN" | "RESOLVED" | "NEEDS_HUMAN" }
     * Response: Updated ticket object
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || status.isBlank()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Status cannot be empty");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Ticket ticket = ticketService.getTicketById(id);
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            Ticket updated = ticketService.updateTicketStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
