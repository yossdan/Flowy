package Model.controller.search;

import Model.controller.search.dto.response.SearchResponseDto;
import Model.controller.search.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SearchResponseDto> generalSearch(@RequestParam String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        SearchResponseDto response = service.generalSearch(keyword.trim());

        return ResponseEntity.ok(response);
    }
}