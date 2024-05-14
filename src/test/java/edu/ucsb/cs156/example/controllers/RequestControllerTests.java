package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = HelpRequestController.class)
@Import(TestConfig.class)
public class RequestControllerTests extends ControllerTestCase {

        @MockBean
        HelpRequestRepository HelpRequestRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/helprequest/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_helprequest() throws Exception {

                // arrange
                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest HelpRequest1 = HelpRequest.builder()
                                .requesterEmail("gracefeng@ucsb.edu")
                                .teamId("15")
                                .tableOrBreakoutRoom("15")
                                .requestTime(requestTime1)
                                .explanation("Trouble with team02")
                                .solved(true)
                                .build();

                LocalDateTime requestTime2 = LocalDateTime.parse("2022-03-11T00:00:00");

                HelpRequest HelpRequest2 = HelpRequest.builder()
                                .requesterEmail("kittygrace101@gmail.com")
                                .teamId("7")
                                .tableOrBreakoutRoom("7")
                                .requestTime(requestTime2)
                                .explanation("Malding")
                                .solved(false)
                                .build();

                ArrayList<HelpRequest> expectedHelpRequest = new ArrayList<>();
                expectedHelpRequest.addAll(Arrays.asList(HelpRequest1, HelpRequest2));

                when(HelpRequestRepository.findAll()).thenReturn(expectedHelpRequest);

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(HelpRequestRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedHelpRequest);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/helprequest/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequest/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/helprequest/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_helprequest() throws Exception {
                // arrange

                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest HelpRequest1 = HelpRequest.builder()
                                .requesterEmail("gracefeng@ucsb.edu")
                                .teamId("15")
                                .tableOrBreakoutRoom("15")
                                .requestTime(requestTime1)
                                .explanation("Help")
                                .solved(true)
                                .build();

                when(HelpRequestRepository.save(eq(HelpRequest1))).thenReturn(HelpRequest1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/helprequest/post?requesterEmail=gracefeng@ucsb.edu&teamId=15&tableOrBreakoutRoom=15&requestTime=2022-01-03T00:00:00&explanation=Help&solved=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(HelpRequestRepository, times(1)).save(HelpRequest1);
                String expectedJson = mapper.writeValueAsString(HelpRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for GET /api/helprequest?id=...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest HelpRequest1 = HelpRequest.builder()
                                .requesterEmail("gracefeng@ucsb.edu")
                                .teamId("15")
                                .tableOrBreakoutRoom("15")
                                .requestTime(requestTime1)
                                .explanation("Help")
                                .solved(true)
                                .build();

                when(HelpRequestRepository.findById(eq(7L))).thenReturn(Optional.of(HelpRequest1));

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(HelpRequestRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(HelpRequest1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(HelpRequestRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/helprequest?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(HelpRequestRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("HelpRequest with id 7 not found", json.get("message"));
        }

        // Tests for DELETE /api/helprequest?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_help_request() throws Exception {
                // arrange

                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest HelpRequest1 = HelpRequest.builder()
                                .requesterEmail("gracefeng@ucsb.edu")
                                .teamId("15")
                                .tableOrBreakoutRoom("15")
                                .requestTime(requestTime1)
                                .explanation("Help")
                                .solved(true)
                                .build();

                when(HelpRequestRepository.findById(eq(15L))).thenReturn(Optional.of(HelpRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(HelpRequestRepository, times(1)).findById(15L);
                verify(HelpRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_helprequest_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(HelpRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/helprequest?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(HelpRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 15 not found", json.get("message"));
        }

        // Tests for PUT /api/helprequest?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_helprequest() throws Exception {
                // arrange

                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime requestTime2 = LocalDateTime.parse("2023-01-03T00:00:00");

                HelpRequest HelpRequestOrig = HelpRequest.builder()
                                .requesterEmail("gracefeng@ucsb.edu")
                                .teamId("15")
                                .tableOrBreakoutRoom("15")
                                .requestTime(requestTime1)
                                .explanation("Help")
                                .solved(true)
                                .build();

                HelpRequest HelpRequestEdited = HelpRequest.builder()
                                .requesterEmail("kittygrace101@gmail.com")
                                .teamId("7")
                                .tableOrBreakoutRoom("7")
                                .requestTime(requestTime2)
                                .explanation("Malding")
                                .solved(false)
                                .build();

                String requestBody = mapper.writeValueAsString(HelpRequestEdited);

                when(HelpRequestRepository.findById(eq(67L))).thenReturn(Optional.of(HelpRequestOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(HelpRequestRepository, times(1)).findById(67L);
                verify(HelpRequestRepository, times(1)).save(HelpRequestEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_helprequest_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime requestTime1 = LocalDateTime.parse("2022-01-03T00:00:00");

                HelpRequest ucsbEditedHelpRequest = HelpRequest.builder()
                                .requesterEmail("kittygrace101@gmail.com")
                                .teamId("7")
                                .tableOrBreakoutRoom("7")
                                .requestTime(requestTime1)
                                .explanation("Malding")
                                .solved(false)
                                .build();

                String requestBody = mapper.writeValueAsString(ucsbEditedHelpRequest);

                when(HelpRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/helprequest?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(HelpRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("HelpRequest with id 67 not found", json.get("message"));

        }
}