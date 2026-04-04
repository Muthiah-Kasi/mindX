package com.example.systemsupport.controller;

import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.entity.User;
import com.example.systemsupport.repository.MessageRepository;
import com.example.systemsupport.repository.TicketRepository;
import com.example.systemsupport.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final MessageRepository messageRepository;

    public AdminController(UserRepository userRepository,
                           TicketRepository ticketRepository,
                           MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
    }

    /**
     * GET /admin/users
     * Optional query param: mobile (search by mobile number)
     * Returns list of users with their latest message info.
     */
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String mobile) {
        try {
            List<User> users;

            if (mobile != null && !mobile.isBlank()) {
                // Search by mobile number
                Optional<User> userOpt = userRepository.findByMobileNumber(mobile);
                users = userOpt.map(List::of).orElse(List.of());
            } else {
                // Return all non-admin users
                users = userRepository.findAll().stream()
                        .filter(u -> !"ADMIN".equals(u.getRole()))
                        .toList();
            }

            List<Map<String, Object>> result = new ArrayList<>();

            for (User user : users) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("userId", user.getId());
                userMap.put("name", user.getName());
                userMap.put("email", user.getEmail());
                userMap.put("mobileNumber", user.getMobileNumber());

                // Get all tickets for this user
                List<Ticket> userTickets = ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

                String latestMessage = "";
                String latestMessageTimestamp = null;
                String currentStatus = "OPEN";

                if (!userTickets.isEmpty()) {
                    Ticket latestTicket = userTickets.get(0);
                    currentStatus = latestTicket.getStatus();

                    // Get latest message across all tickets
                    Message lastMsg = null;
                    for (Ticket t : userTickets) {
                        List<Message> msgs = messageRepository.findByTicketId(t.getId());
                        for (Message m : msgs) {
                            if (lastMsg == null || m.getTimestamp().isAfter(lastMsg.getTimestamp())) {
                                lastMsg = m;
                            }
                        }
                    }

                    if (lastMsg != null) {
                        latestMessage = lastMsg.getMessage();
                        latestMessageTimestamp = lastMsg.getTimestamp().toString();
                    }
                }

                userMap.put("latestMessage", latestMessage);
                userMap.put("latestMessageTimestamp", latestMessageTimestamp);
                userMap.put("currentStatus", currentStatus);

                result.add(userMap);
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /admin/users/{userId}/messages
     * Returns full conversation history for a user across all tickets.
     */
    @GetMapping("/users/{userId}/messages")
    public ResponseEntity<?> getUserMessages(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            List<Ticket> userTickets = ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

            // Collect all messages across all tickets, sorted by timestamp
            List<Message> allMessages = new ArrayList<>();
            for (Ticket t : userTickets) {
                allMessages.addAll(messageRepository.findByTicketId(t.getId()));
            }
            allMessages.sort(Comparator.comparing(Message::getTimestamp));

            // Get latest ticket status
            String currentStatus = "OPEN";
            if (!userTickets.isEmpty()) {
                currentStatus = userTickets.get(0).getStatus();
            }

            Map<String, Object> response = new HashMap<>();
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("email", user.getEmail());
            userInfo.put("mobileNumber", user.getMobileNumber());
            userInfo.put("currentStatus", currentStatus);

            response.put("user", userInfo);
            response.put("messages", allMessages);

            // Include ticket IDs for status updates
            if (!userTickets.isEmpty()) {
                response.put("latestTicketId", userTickets.get(0).getId());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
