import { render, fireEvent } from "../test-config/test-utils";
import App from "../pages/index";
import { demoData } from "../test-config/demoData";

describe("renders appropriately", () => {
  // reset fetch mocks between tests
  beforeEach(() => {
    fetch.resetMocks();
  });

  // mock the global alert() fn
  global.alert = jest.fn();

  it("renders without crashing", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findByText } = render(<App />);

    // sub-title of list of actions
    expect(
      await findByText(/Ordered from latest to first/i)
    ).toBeInTheDocument();
  });

  it("shows a loader", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { getByTestId } = render(<App />);

    // loader component has a data-testid
    expect(getByTestId("loader-component")).toBeInTheDocument();
  });

  it("fetches and renders a list", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findByText, findAllByTestId } = render(<App />);

    // get all items with the data-testid prefix 'sortable-post-list-'
    let allSortableListItems = await findAllByTestId(/sortable-post-list-/);

    // expect the list to have length 5
    expect(allSortableListItems).toHaveLength(5);

    // expect the list to contain list items in correct order
    // Nb: data is from mocked fetch

    // first list item
    expect(allSortableListItems[0]).toHaveTextContent(
      "1: sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
    );

    // last list item
    expect(allSortableListItems[4]).toHaveTextContent("5: nesciunt quas odio");
  });

  it("moves a list item down", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findAllByTestId, findByTestId } = render(<App />);

    // get all items with the data-testid prefix 'sortable-post-list-'
    let allSortableListItems = await findAllByTestId(/sortable-post-list-/);

    // expect the list to have length 5
    expect(allSortableListItems).toHaveLength(5);

    // expect the list to contain list items in correct order
    // Nb: data is from mocked fetch

    // first list item
    expect(allSortableListItems[0]).toHaveTextContent(
      "1: sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
    );

    // second list item
    expect(allSortableListItems[1]).toHaveTextContent("2: qui est esse");

    // click down arrow to send index 0 to index 1
    // and index 1 to index 0
    fireEvent.click(await findByTestId("arrow-down-0"));

    // confirm they moved/changed

    // get all items with the data-testid prefix 'sortable-post-list-'
    let allSortableListItems2 = await findAllByTestId(/sortable-post-list-/);

    // expect the list to have length 5
    expect(allSortableListItems2).toHaveLength(5);

    // expect the list to contain list items in new order
    // Nb: data is from mocked fetch

    // item 2 is now the first list item
    expect(allSortableListItems2[0]).toHaveTextContent("2: qui est esse");

    // item 1 is now the second list item
    expect(allSortableListItems2[1]).toHaveTextContent(
      "1: sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
    );
  });

  it("moves a list item up", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findAllByTestId, findByTestId, findByText } = render(<App />);

    // get all items with the data-testid prefix 'sortable-post-list-'
    let allSortableListItems = await findAllByTestId(/sortable-post-list-/);

    // expect the list to have length 5
    expect(allSortableListItems).toHaveLength(5);

    // expect the list to contain list items in correct order
    // Nb: data is from mocked fetch

    // last list item
    // originally at index 4
    expect(allSortableListItems[4]).toHaveTextContent("5: nesciunt quas odio");

    // second last list item
    // originally at index 3
    expect(allSortableListItems[3]).toHaveTextContent(
      "4: eum et est occaecati"
    );

    // click up arrow to send index 4 to index 3
    // and index 3 to index 4
    fireEvent.click(await findByTestId("arrow-up-4"));

    // confirm they moved/changed

    // get all items with the data-testid prefix 'sortable-post-list-'
    let allSortableListItems2 = await findAllByTestId(/sortable-post-list-/);

    // expect the list to have length 5
    expect(allSortableListItems2).toHaveLength(5);

    // expect the list to contain list items in new order
    // Nb: data is from mocked fetch

    // item 4 is now the last list item
    expect(allSortableListItems2[4]).toHaveTextContent(
      "4: eum et est occaecati"
    );

    // item 5 is now the second last list item
    expect(allSortableListItems2[3]).toHaveTextContent("5: nesciunt quas odio");
  });

  it("shows a list of last committed actions", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findByText, queryByText, findByTestId, findAllByTestId } = render(
      <App />
    );

    // expect no last committed action on initial render
    // expect to find zero time-travel buttons
    expect(queryByText("Time Travel")).not.toBeInTheDocument();

    // click down button on first item
    fireEvent.click(await findByTestId("arrow-down-0"));

    // expect one last committed action to appear
    expect(await findAllByTestId(/time-travel-/)).toHaveLength(1);

    // expect the action to be appropriately named
    expect(
      await findByText("moved post 1 from index 0 to index 1")
    ).toBeInTheDocument();

    // click up button on last item
    fireEvent.click(await findByTestId("arrow-up-4"));

    // expect two last committed actions now
    expect(await findAllByTestId(/time-travel-/)).toHaveLength(2);

    // expect new last committed action to be named appropriately
    expect(
      await findByText("moved post 4 from index 3 to index 4")
    ).toBeInTheDocument();
  });

  it("time travels on action button click", async () => {
    fetch.mockResponseOnce(JSON.stringify(demoData));

    const { findByText, queryByText, findByTestId, findAllByTestId } = render(
      <App />
    );

    // expect no last committed action on initial render
    // expect to find zero time-travel buttons
    expect(queryByText("Time Travel")).not.toBeInTheDocument();

    // click down button on first item
    fireEvent.click(await findByTestId("arrow-down-0"));

    // expect one last committed action to appear
    expect(await findAllByTestId(/time-travel-/)).toHaveLength(1);

    // expect the action to be appropriately named
    expect(
      await findByText("moved post 1 from index 0 to index 1")
    ).toBeInTheDocument();

    // click up button on last item
    fireEvent.click(await findByTestId("arrow-up-4"));

    // expect two last committed actions now
    expect(await findAllByTestId(/time-travel-/)).toHaveLength(2);

    // expect new last committed action to be named appropriately
    expect(
      await findByText("moved post 4 from index 3 to index 4")
    ).toBeInTheDocument();

    // click latest last committed action time travel button
    fireEvent.click(await findByTestId("time-travel-0"));

    // expect latest last committed action to disappear
    expect(
      queryByText("moved post 4 from index 3 to index 4")
    ).not.toBeInTheDocument();

    // click remaining action time travel button
    fireEvent.click(await findByTestId("time-travel-0"));

    // expect last committed action to also disappear
    expect(
      queryByText("moved post 1 from index 0 to index 1")
    ).not.toBeInTheDocument();

    // expect no last committed action on initial render
    // expect to find zero time-travel buttons
    expect(queryByText("Time Travel")).not.toBeInTheDocument();
  });
});
