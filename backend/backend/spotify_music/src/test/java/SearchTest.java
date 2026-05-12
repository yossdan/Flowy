import App.App;
import Model.controller.search.dto.response.SearchResponseDto;
import Model.controller.search.service.SearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = App.class)
public class SearchTest {
    @Autowired
    SearchService searchService;
     @Test
    void search(){
         SearchResponseDto response = searchService.generalSearch("mi");
         System.out.println(response);
     }
}
