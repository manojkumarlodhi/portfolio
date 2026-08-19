package com.portfolio.repository;

import com.portfolio.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String>, JpaSpecificationExecutor<Message> {
    List<Message> findAllByOrderByCreatedAtDesc();
    List<Message> findByIsReadFalseOrderByCreatedAtDesc();
    long countByIsReadFalse();
}
