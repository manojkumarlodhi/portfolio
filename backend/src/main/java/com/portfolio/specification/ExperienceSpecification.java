package com.portfolio.specification;

import com.portfolio.entity.Experience;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ExperienceSpecification {

    public static Specification<Experience> withFilters(String type, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(cb.lower(root.get("type")), type.trim().toLowerCase()));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate companyLike = cb.like(cb.lower(root.get("company")), pattern);
                Predicate roleLike = cb.like(cb.lower(root.get("role")), pattern);
                Predicate contextLike = cb.like(cb.lower(root.get("context")), pattern);
                predicates.add(cb.or(companyLike, roleLike, contextLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
