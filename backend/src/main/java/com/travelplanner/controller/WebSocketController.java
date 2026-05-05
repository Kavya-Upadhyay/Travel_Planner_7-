package com.travelplanner.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.UUID;

/**
 * WebSocketController — handles real-time messages for itinerary,
 * expense, and poll updates. When a client sends an update,
 * it's broadcast to all subscribers of that trip's channel.
 */
@Controller
public class WebSocketController {

    /**
     * Client sends to: /app/trip/{tripId}/itinerary
     * Server broadcasts to: /topic/trip/{tripId}/itinerary
     */
    @MessageMapping("/trip/{tripId}/itinerary")
    @SendTo("/topic/trip/{tripId}/itinerary")
    public Map<String, Object> handleItineraryUpdate(
            @DestinationVariable UUID tripId,
            Map<String, Object> message) {
        // Broadcast the change to all trip subscribers
        message.put("tripId", tripId.toString());
        message.put("timestamp", System.currentTimeMillis());
        return message;
    }

    @MessageMapping("/trip/{tripId}/expenses")
    @SendTo("/topic/trip/{tripId}/expenses")
    public Map<String, Object> handleExpenseUpdate(
            @DestinationVariable UUID tripId,
            Map<String, Object> message) {
        message.put("tripId", tripId.toString());
        message.put("timestamp", System.currentTimeMillis());
        return message;
    }

    @MessageMapping("/trip/{tripId}/polls")
    @SendTo("/topic/trip/{tripId}/polls")
    public Map<String, Object> handlePollUpdate(
            @DestinationVariable UUID tripId,
            Map<String, Object> message) {
        message.put("tripId", tripId.toString());
        message.put("timestamp", System.currentTimeMillis());
        return message;
    }
}
