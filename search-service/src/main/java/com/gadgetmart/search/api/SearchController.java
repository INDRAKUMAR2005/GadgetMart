package com.gadgetmart.search.api;

import com.gadgetmart.search.model.ProductIndex;
import com.gadgetmart.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public List<ProductIndex> search(@RequestParam String q) {
        return searchService.searchProducts(q);
    }

    @PostMapping("/index")
    public void index(@RequestBody ProductIndex product) {
        searchService.indexProduct(product);
    }
}
