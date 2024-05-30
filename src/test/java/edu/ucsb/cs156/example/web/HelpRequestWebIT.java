package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import edu.ucsb.cs156.example.WebTestCase;
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void user_can_create_help_request_with_required_fields_filled() throws Exception {
        // Setup user permissions
        setupUser(true);
    
        // Navigate to the page with help request functionality
        page.getByText("Help Request").click();
    
        // Click on "Create Help Request" button
        page.getByText("Create HelpRequest").click();
    
        // Verify that the form is visible
        assertThat(page.getByText("Create New HelpRequest")).isVisible();
    
        // Fill in the required fields except requestTime
        page.getByTestId("HelpRequestForm-requesterEmail").fill("user@example.com");
        page.getByTestId("HelpRequestForm-teamID").fill("team-123");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table-1");
    
        // Click on the submit button
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByText("requestTime is required.")).isVisible();
    
        // assertThat(page.getByTestId("HelpRequestTable")).isEmpty();
    }    
    @Test
    public void user_cannot_create_help_request() throws Exception {
        setupUser(false);
        page.getByText("Help Request").click();
        assertThat(page.getByText("Create Help Request")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable")).not().isVisible();
    }
}
