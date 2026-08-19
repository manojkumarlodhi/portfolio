package com.portfolio.service;

import com.portfolio.dto.request.MessageRequest;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Message;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface MessageService {
    Message submitMessage(MessageRequest request, String clientIp);
    PageResponse<Message> getMessages(String search, Boolean isRead, LocalDate startDate, LocalDate endDate, Pageable pageable);
    List<Message> getAllMessages();
    Message getMessageById(String id);
    Message markAsRead(String id, boolean isRead);
    void markAllAsRead();
    void deleteMessage(String id);
    void bulkDeleteMessages(List<String> ids);
    long getUnreadCount();
}
