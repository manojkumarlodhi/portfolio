package com.portfolio.service.impl;

import com.portfolio.config.RateLimitConfig;
import com.portfolio.dto.request.MessageRequest;
import com.portfolio.dto.response.PageResponse;
import com.portfolio.entity.Message;
import com.portfolio.exception.RateLimitExceededException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.MessageRepository;
import com.portfolio.service.MessageService;
import com.portfolio.specification.MessageSpecification;
import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final RateLimitConfig rateLimitConfig;

    @Override
    @Transactional
    public Message submitMessage(MessageRequest request, String clientIp) {
        Bucket bucket = rateLimitConfig.resolveBucket(clientIp != null ? clientIp : "anonymous");
        if (!bucket.tryConsume(1)) {
            throw new RateLimitExceededException("Too many messages sent. Please wait before submitting another message.");
        }

        Message message = Message.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .message(request.getMessage().trim())
                .isRead(false)
                .build();

        return messageRepository.save(message);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Message> getMessages(String search, Boolean isRead, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Page<Message> page = messageRepository.findAll(
                MessageSpecification.withFilters(search, isRead, startDate, endDate),
                pageable
        );
        return PageResponse.of(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Message getMessageById(String id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with ID: " + id));
    }

    @Override
    @Transactional
    public Message markAsRead(String id, boolean isRead) {
        Message message = getMessageById(id);
        message.setIsRead(isRead);
        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        List<Message> unread = messageRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void deleteMessage(String id) {
        Message message = getMessageById(id);
        messageRepository.delete(message);
    }

    @Override
    @Transactional
    public void bulkDeleteMessages(List<String> ids) {
        if (ids != null && !ids.isEmpty()) {
            messageRepository.deleteAllById(ids);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return messageRepository.countByIsReadFalse();
    }
}
