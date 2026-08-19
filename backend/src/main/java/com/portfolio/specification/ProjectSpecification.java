package com.portfolio.specification;

import com.portfolio.entity.Project;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProjectSpecification {

    public static Specification<Project> withFilters(String category, String search, Boolean featured) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (featured != null) {
                predicates.add(cb.equal(root.get("featured"), featured));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                Predicate summaryLike = cb.like(cb.lower(root.get("summary")), pattern);
                predicates.add(cb.or(titleLike, summaryLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
