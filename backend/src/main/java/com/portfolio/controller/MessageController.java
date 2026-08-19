package com.portfolio.controller;

import com.portfolio.dto.request.MessageRequest;
import com.portfolio.dto.response.ApiResponse;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Message;
import com.portfolio.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Contact messages — public POST, protected admin endpoints with search/filter/pagination")
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/messages")
    @Operation(summary = "Submit Contact Message (Public, rate-limited)")
    public ResponseEntity<ApiResponse<Message>> submitMessage(
            @Valid @RequestBody MessageRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(messageService.submitMessage(request, clientIp), "Message sent successfully! I'll get back to you soon."));
    }

    @GetMapping("/admin/messages")
    @Operation(summary = "Get Messages with Filters & Pagination", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PageResponse<Message>>> getMessages(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(
                messageService.getMessages(search, isRead, startDate, endDate, pageable)));
    }

    @GetMapping("/admin/messages/{id}")
    @Operation(summary = "Get Message By ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Message>> getMessageById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(messageService.getMessageById(id)));
    }

    @GetMapping("/admin/messages/unread-count")
    @Operation(summary = "Get Unread Message Count", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", messageService.getUnreadCount())));
    }

    @PatchMapping("/admin/messages/{id}/read")
    @Operation(summary = "Mark Message as Read/Unread", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Message>> markAsRead(
            @PathVariable String id,
            @RequestParam(defaultValue = "true") boolean isRead) {
        return ResponseEntity.ok(ApiResponse.ok(messageService.markAsRead(id, isRead), "Message marked as " + (isRead ? "read" : "unread")));
    }

    @PostMapping("/admin/messages/mark-all-read")
    @Operation(summary = "Mark All Messages as Read", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        messageService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.ok(null, "All messages marked as read"));
    }

    @DeleteMapping("/admin/messages/{id}")
    @Operation(summary = "Delete Message", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable String id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Message deleted successfully"));
    }

    @DeleteMapping("/admin/messages/bulk-delete")
    @Operation(summary = "Bulk Delete Messages", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> bulkDeleteMessages(@RequestBody List<String> ids) {
        messageService.bulkDeleteMessages(ids);
        return ResponseEntity.ok(ApiResponse.ok(null, ids.size() + " messages deleted successfully"));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
