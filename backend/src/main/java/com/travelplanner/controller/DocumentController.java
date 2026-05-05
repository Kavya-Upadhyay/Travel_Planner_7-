package com.travelplanner.controller;

import com.travelplanner.model.entity.User;
import com.travelplanner.service.AuthService;
import com.travelplanner.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<DocumentService.DocumentDTO> upload(
            @PathVariable UUID tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "activityId", required = false) UUID activityId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.uploadDocument(tripId, file, category, activityId, userId));
    }

    @GetMapping
    public ResponseEntity<List<DocumentService.DocumentDTO>> getAll(
            @PathVariable UUID tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        return ResponseEntity.ok(documentService.getTripDocuments(tripId, userId));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID tripId,
            @PathVariable UUID documentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getAuthUserId(userDetails);
        documentService.deleteDocument(tripId, documentId, userId);
        return ResponseEntity.noContent().build();
    }

    private UUID getAuthUserId(UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return user.getId();
    }
}
