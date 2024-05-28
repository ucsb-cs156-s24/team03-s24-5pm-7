package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        // arrange
        HelpRequest helpRequest = HelpRequest.builder()
                .requesterEmail("user@example.com")
                .teamID("team-123")
                .tableOrBreakoutRoom("table-1")
                .requestTime(LocalDateTime.now())
                .explanation("I need assistance with something.")
                .solved(false)
                .build();

        helpRequest = helpRequestRepository.save(helpRequest);

        // act
        MvcResult response = mockMvc.perform(get("/api/helprequest?id=" + helpRequest.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requesterEmail").value("user@example.com"))
                .andExpect(jsonPath("$.teamID").value("team-123"))
                .andExpect(jsonPath("$.tableOrBreakoutRoom").value("table-1"))
                .andExpect(jsonPath("$.explanation").value("I need assistance with something."))
                .andExpect(jsonPath("$.solved").value(false))
                .andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(helpRequest);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_help_request() throws Exception {
        // arrange
        LocalDateTime requestTime = LocalDateTime.now();
        String requesterEmail = "user@example.com";
        String teamID = "team-123";
        String tableOrBreakoutRoom = "table-1";
        String explanation = "I need assistance with something.";
        Boolean solved = false;

        // act
        MvcResult response = mockMvc.perform(
                post("/api/helprequest/post")
                        .param("requesterEmail", requesterEmail)
                        .param("teamID", teamID)
                        .param("tableOrBreakoutRoom", tableOrBreakoutRoom)
                        .param("requestTime", requestTime.toString()) // Convert LocalDateTime to String
                        .param("explanation", explanation)
                        .param("solved", solved.toString()) // Convert Boolean to String
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requesterEmail").value(requesterEmail))
                .andExpect(jsonPath("$.teamID").value(teamID))
                .andExpect(jsonPath("$.tableOrBreakoutRoom").value(tableOrBreakoutRoom))
                .andExpect(jsonPath("$.explanation").value(explanation))
                .andExpect(jsonPath("$.solved").value(solved))
                .andReturn();

        // assert
        String responseString = response.getResponse().getContentAsString();
        HelpRequest helpRequestResponse = mapper.readValue(responseString, HelpRequest.class);

        HelpRequest helpRequest1 = HelpRequest.builder()
                .id(helpRequestResponse.getId())
                .requesterEmail(requesterEmail)
                .teamID(teamID)
                .tableOrBreakoutRoom(tableOrBreakoutRoom)
                .requestTime(requestTime)
                .explanation(explanation)
                .solved(solved)
                .build();

        String expectedJson = mapper.writeValueAsString(helpRequest1);
        assertEquals(expectedJson, responseString);
    }
}
