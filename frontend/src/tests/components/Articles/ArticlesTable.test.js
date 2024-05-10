import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
  }));
  
  describe("UserTable tests", () => {
    const queryClient = new QueryClient();
  
    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        const expectedHeaders = ["id", "Title", "URL", "Explanation", "Email", "dateAdded"];
        const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
        const testId = "ArticlesTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Using testing-playground with React Testing Library");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent( "Helpful when we get to front end development");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("phtcon@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-04-20T12:00:00");
    
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Handy Spring Utility Classes");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://twitter.com/maciejwalkowiak/status/1511736828369719300?t=gGXpmBH4y4eY9OBSUInZEg&s=09");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("A lot of really useful classes are built into Spring");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("phtcon@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-04-19T12:00:00");
    
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("Article1");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("https://fakewebsite/a1.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-explanation`)).toHaveTextContent("This is article 1");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-email`)).toHaveTextContent("zhenbi@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateAdded`)).toHaveTextContent("2022-04-20T12:00:00");
    
        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();
    
        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
    
      });
    
    test("Has the expected column headers, content and buttons for admin user", () => {
      const currentUser = currentUserFixtures.adminUser;
  

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      const expectedHeaders = ["id", "Title", "URL", "Explanation", "Email", "dateAdded"];
      const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
      const testId = "ArticlesTable";

      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
  
      expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Using testing-playground with React Testing Library");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent( "Helpful when we get to front end development");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("phtcon@ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-04-20T12:00:00");
  
      expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Handy Spring Utility Classes");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://twitter.com/maciejwalkowiak/status/1511736828369719300?t=gGXpmBH4y4eY9OBSUInZEg&s=09");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("A lot of really useful classes are built into Spring");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("phtcon@ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-04-19T12:00:00");
  
      expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("Article1");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("https://fakewebsite/a1.com");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-explanation`)).toHaveTextContent("This is article 1");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-email`)).toHaveTextContent("zhenbi@ucsb.edu");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-dateAdded`)).toHaveTextContent("2022-04-20T12:00:00");
  
      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass("btn-primary");
  
      const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass("btn-danger");
  
    });
  
    test("Edit button navigates to the edit page", async () => {
      // arrange
      const currentUser = currentUserFixtures.adminUser;
        
      const expectedHeaders = ["id", "Title", "URL", "Explanation", "Email", "dateAdded"];
      const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
      const testId = "ArticlesTable";

      // act - render the component
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
      // assert - check that the expected content is rendered
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Using testing-playground with React Testing Library");
  
      const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
      expect(editButton).toBeInTheDocument();
  
      // act - click the edit button
      fireEvent.click(editButton);
  
      // assert - check that the navigate function was called with the expected path
      await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/Articles/edit/1'));
  
    });
  });