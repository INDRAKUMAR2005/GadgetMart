package com.gadgetmart.search.service;

import com.gadgetmart.search.model.ProductIndex;
import com.gadgetmart.search.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final ProductSearchRepository productSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    public List<ProductIndex> searchProducts(String query) {
        log.info("Searching for: {} (fuzzy)", query);
        
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(q -> q
                        .multiMatch(m -> m
                                .fields("name", "description")
                                .query(query)
                                .fuzziness("AUTO")
                        )
                )
                .build();

        SearchHits<ProductIndex> searchHits = elasticsearchOperations.search(nativeQuery, ProductIndex.class);
        
        return searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public void indexProduct(ProductIndex product) {
        log.info("Indexing product: {}", product.getName());
        productSearchRepository.save(product);
    }
}
