package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "HelpRequest")
@RequestMapping("/api/helprequest")
@RestController
@Slf4j
public class HelpRequestController extends ApiController {

    @Autowired
    HelpRequestRepository HelpRequestRepository;

    // Get all records in the table and return as a JSON array
    @Operation(summary= "List all ucsb help requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<HelpRequest> allUCSBDates() {
        Iterable<HelpRequest> helpRequests = HelpRequestRepository.findAll();
        return helpRequests;
    }

    // Use the data in the input parameters to create a new row in the table and return the data as JSON
    @Operation(summary= "Create a new help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public HelpRequest postHelpRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="teamID") @RequestParam String teamID,
            @Parameter(name="tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
            @Parameter(name="requestTime") @RequestParam("requestTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime requestTime,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="solved") @RequestParam Boolean solved)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("localDateTime={}", requestTime);

        HelpRequest HelpRequest = new HelpRequest();
        HelpRequest.setRequesterEmail(requesterEmail);
        HelpRequest.setTeamID(teamID);
        HelpRequest.setTableOrBreakoutRoom(tableOrBreakoutRoom);
        HelpRequest.setRequestTime(requestTime);
        HelpRequest.setExplanation(explanation);
        HelpRequest.setSolved(solved);

        HelpRequest savedHelpRequest = HelpRequestRepository.save(HelpRequest);

        return savedHelpRequest;
    }

    @Operation(summary= "Get a single help request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public HelpRequest getById(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequest HelpRequest = HelpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        return HelpRequest;
    }

    @Operation(summary= "Delete a HelpRequest")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteHelpRequest(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequest HelpRequest = HelpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        HelpRequestRepository.delete(HelpRequest);
        return genericMessage("HelpRequest with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public HelpRequest updateHelpRequest(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid HelpRequest incoming) {

        HelpRequest HelpRequest = HelpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        HelpRequest.setRequesterEmail(incoming.getRequesterEmail());
        HelpRequest.setTeamID(incoming.getTeamID());
        HelpRequest.setTableOrBreakoutRoom(incoming.getTableOrBreakoutRoom());
        HelpRequest.setRequestTime(incoming.getRequestTime());
        HelpRequest.setExplanation(incoming.getExplanation());
        HelpRequest.setSolved(incoming.getSolved());

        HelpRequestRepository.save(HelpRequest);

        return HelpRequest;
    }
}