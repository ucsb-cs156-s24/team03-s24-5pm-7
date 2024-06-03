package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;
import static org.skyscreamer.jsonassert.JSONCompareMode.LENIENT;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

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
                        .requesterEmail("test@example.com")
                        .teamId("team1")
                        .tableOrBreakoutRoom("table1")
                        .requestTime(LocalDateTime.now())
                        .explanation("Need help with assignment")
                        .solved(false)
                        .build();

        helpRequest = helpRequestRepository.save(helpRequest);

        // act
        MvcResult response = mockMvc.perform(get("/api/helprequests?id=" + helpRequest.getId()))
                        .andExpect(status().isOk()).andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(helpRequest);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expectedJson, responseString, LENIENT);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_helpRequest() throws Exception {
        // arrange
        HelpRequest helpRequest = HelpRequest.builder()
                        .requesterEmail("admin@example.com")
                        .teamId("team2")
                        .tableOrBreakoutRoom("table2")
                        .requestTime(LocalDateTime.now())
                        .explanation("Need urgent help")
                        .solved(false)
                        .build();

        // act
        MvcResult response = mockMvc.perform(
                        post("/api/helprequests/post")
                        .param("requesterEmail", "admin@example.com")
                        .param("teamId", "team2")
                        .param("tableOrBreakoutRoom", "table2")
                        .param("requestTime", helpRequest.getRequestTime().toString())
                        .param("explanation", "Need urgent help")
                        .param("solved", "false")
                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn();

        String responseString = response.getResponse().getContentAsString();
        HelpRequest savedHelpRequest = mapper.readValue(responseString, HelpRequest.class);

        assertEquals(helpRequest.getRequesterEmail(), savedHelpRequest.getRequesterEmail());
        assertEquals(helpRequest.getTeamId(), savedHelpRequest.getTeamId());
        assertEquals(helpRequest.getTableOrBreakoutRoom(), savedHelpRequest.getTableOrBreakoutRoom());
        assertEquals(helpRequest.getExplanation(), savedHelpRequest.getExplanation());
        assertEquals(helpRequest.getSolved(), savedHelpRequest.getSolved());
    }
}