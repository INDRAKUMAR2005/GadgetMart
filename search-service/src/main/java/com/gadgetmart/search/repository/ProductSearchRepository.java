package com.gadgetmart.search.repository;

import com.gadgetmart.search.model.ProductIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface ProductSearchRepository extends ElasticsearchRepository<ProductIndex, String> {
    List<ProductIndex> findByNameContainingIgnoreCase(String name);
}
