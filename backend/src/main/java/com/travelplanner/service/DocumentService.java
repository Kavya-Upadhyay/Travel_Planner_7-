package com.travelplanner.service;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.model.entity.*;
import com.travelplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * DocumentService — handles file uploads and document vault management.
 * Files are stored on local filesystem (can be swapped for S3 in production).
 */
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TripService tripService;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.file.allowed-types:image/jpeg,image/png,image/gif,application/pdf,text/plain}")
    private String allowedTypes;

    @Transactional
    public DocumentDTO uploadDocument(UUID tripId, MultipartFile file, String category,
                                       UUID activityId, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Trip trip = tripService.findTripOrThrow(tripId);
        User uploader = userRepository.findById(userId).orElseThrow();

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BadRequestException("File type not allowed: " + contentType);
        }

        // Save file to filesystem with UUID name to prevent path traversal
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + fileExtension;
        Path uploadPath = Paths.get(uploadDir, tripId.toString());

        try {
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(storedFileName);
            file.transferTo(filePath.toFile());

            Document document = Document.builder()
                    .trip(trip)
                    .uploadedBy(uploader)
                    .fileName(file.getOriginalFilename())
                    .fileUrl("/uploads/" + tripId + "/" + storedFileName)
                    .fileSize(file.getSize())
                    .mimeType(contentType)
                    .category(Document.DocumentCategory.valueOf(
                            category != null ? category.toUpperCase() : "OTHER"))
                    .build();

            if (activityId != null) {
                Activity activity = activityRepository.findById(activityId).orElse(null);
                document.setActivity(activity);
            }

            document = documentRepository.save(document);
            return mapToDTO(document);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public List<DocumentDTO> getTripDocuments(UUID tripId, UUID userId) {
        tripService.verifyMembership(tripId, userId);
        return documentRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteDocument(UUID tripId, UUID documentId, UUID userId) {
        tripService.verifyEditAccess(tripId, userId);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        documentRepository.delete(document);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    private DocumentDTO mapToDTO(Document d) {
        return DocumentDTO.builder()
                .id(d.getId())
                .tripId(d.getTrip().getId())
                .fileName(d.getFileName())
                .fileUrl(d.getFileUrl())
                .fileSize(d.getFileSize())
                .mimeType(d.getMimeType())
                .category(d.getCategory())
                .activityId(d.getActivity() != null ? d.getActivity().getId() : null)
                .uploadedById(d.getUploadedBy().getId())
                .uploadedByName(d.getUploadedBy().getFullName())
                .build();
    }

    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    public static class DocumentDTO {
        private UUID id;
        private UUID tripId;
        private String fileName;
        private String fileUrl;
        private Long fileSize;
        private String mimeType;
        private Document.DocumentCategory category;
        private UUID activityId;
        private UUID uploadedById;
        private String uploadedByName;
    }
}
