import { useState, useEffect, useContext } from "react";
import { fetchPosts } from "../api/fetchPosts";
import { PostsContext } from "../components/globalState";
import LoaderImage from "../assets/bars.svg";

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  // get data and dispatch from context
  const {
    Posts: { Present, Past },
    dispatchPosts,
  } = useContext(PostsContext);

  useEffect(() => {
    // start loading
    setLoading(true);
    // fetch all posts for given userId
    fetchPosts()
      // then filter for only the first 5
      .then((posts) => posts.filter((_, index) => index < 5))
      // then dispatch to global context
      .then((data) => {
        dispatchPosts({
          type: "INITIAL_FETCH",
          payload: data,
        });
        // finish loading
        setLoading(false);
      });
  }, []);

  // move list items up or down
  const moveListItem = (direction, current_index) => {
    if (direction === "UP") {
      // dispatch action MOVE_UP with new index less with one
      return dispatchPosts({
        type: "MOVE_UP",
        payload: { index1: current_index, index2: current_index - 1 },
      });
    }
    // dispatch action MOVE_DOWN with new index more with one
    return dispatchPosts({
      type: "MOVE_DOWN",
      payload: { index1: current_index, index2: current_index + 1 },
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full mb-10 md:mb-0 bg-gray-50">
      {/* svg triangle header */}
      <div className="flex w-full h-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="none"
          x="0px"
          y="0px"
          viewBox="0 0 120 120"
          enableBackground="new 0 0 120 120"
          className="w-full h-full"
          xmlSpace="preserve"
        >
          <polygon
            points="0,0 0,120 120,0"
            className="text-purple-800 fill-current"
          />
        </svg>
      </div>
      {/* main content container */}
      <div className="flex flex-col md:flex-row w-full -mt-32 justify-center space-y-10 md:space-x-16 ">
        {/* sortable post list */}
        <div className="flex flex-col w-11/12 md:w-5/12 mx-auto md:mx-0 ">
          <h3 className="text-2xl text-white font-semibold">
            Sortable Post List
          </h3>
          <ul className="flex flex-col flex-nowrap space-y-6 mt-4">
            {/* show loader when loading */}
            {loading ? (
              <img
                className="flex w-4/12 h-3/6 md:w-8/12 md:h-3/6 mx-auto mt-6 md:my-auto"
                src={LoaderImage}
                alt="loader indicator"
              />
            ) : (
              Present.map(({ id, title }, index) => (
                <li
                  key={id}
                  className="flex flex-row flex-nowrap justify-between w-full h-20 items-center p-2 text-gray-600 bg-white rounded-md shadow-xl"
                >
                  <div>
                    <h3>{`${id}: ${title}`}</h3>
                  </div>
                  <div className="flex flex-col flex-nowrap space-y-4">
                    {/* key up */}
                    {index !== 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-purple-900 w-5 h-5 transform cursor-pointer hover:scale-125"
                        onClick={() => moveListItem("UP", index)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {/* key down */}
                    {index !== Present.length - 1 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-purple-900 w-5 h-5 transform cursor-pointer hover:scale-125"
                        onClick={() => moveListItem("DOWN", index)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {/* actions list */}
        <div className="flex flex-col w-11/12 md:w-5/12 mx-auto md:mx-0 bg-gray-100 rounded-md shadow-2xl h-5/6">
          <h3 className="text-xl text-gray-600 font-semibold mt-4 ml-6">
            List of actions committed
          </h3>
          <ul className="flex flex-col flex-nowrap space-y-1 mt-8 py-0 px-0 md:py-8 md:px-2 bg-gray-200 max-h-96 overflow-y-scroll">
            {/* the order is Latest actions to Oldest actions */}
            {/* compare last item pushed to Past array (immediate past 'present array') with current Present Array */}
            {/* check if Past array has at least an entry and the entry is not empty */}
            {Past?.[Past.length - 1]?.length &&
              Past[Past.length - 1].map((immediateLatest, index) => {
                // if item at current index in immediate latest
                // is not the same as item in the same index in current latest
                // mark as change
                if (immediateLatest.id !== Present[index]["id"]) {
                  return (
                    <li
                      key={immediateLatest.id}
                      className="flex flex-row flex-nowrap justify-between items-center w-full md:w-11/12 mx-auto h-20 p-2 text-gray-500 bg-white rounded-md shadow-xl"
                    >
                      <div>
                        {/* moved from current id in Past array to id of the same item in the present array */}
                        <h3>{`moved post ${
                          immediateLatest.id
                        } from index ${index} to index ${Present.findIndex(
                          (entry) => entry.id === immediateLatest.id
                        )} by1`}</h3>
                      </div>
                      <div className="flex flex-col flex-nowrap space-y-4">
                        <button
                          type="button"
                          className="bg-green-400 text-gray-900 h-12 w-32 rounded-md transform hover:scale-105 focus:outline-none"
                          onClick={() => {
                            // dispatch previous state to be pushed to present
                            dispatchPosts({
                              type: "TIME_TRAVEL",
                              payload: {
                                pastState: Past[Past.length - 1],
                              },
                            });
                          }}
                        >
                          Time Travel
                        </button>
                      </div>
                    </li>
                  );
                }
              })}
            {/* reverse the array to get the immediate latest states first before the earlier states */}
            {Past.length > 1 &&
              // returns latest array item to be pushed to past
              // (earlier rep of Present)
              Past.reverse().map((latestState, index) => {
                // don't map last item because no last item +1 to compare against
                if (index !== Past.length - 1) {
                  return (
                    <React.Fragment key={index}>
                      {/* returns individual entries in immediate former Present array */}
                      {latestState.map((currentIndex, i) => {
                        if (
                          currentIndex.id !==
                          Past.reverse()[index + 1]?.[i]?.["id"]
                        ) {
                          return (
                            <li
                              key={currentIndex.id}
                              className="flex flex-row flex-nowrap justify-between items-center w-full md:w-11/12 mx-auto h-20 p-2 text-gray-500 bg-white rounded-md shadow-xl"
                            >
                              <div>
                                <h3>{`moved post ${
                                  currentIndex.id
                                } from index ${Past.reverse()[
                                  index + 1
                                ].findIndex(
                                  (entry) => entry.id === currentIndex.id
                                )} to index ${index} by2`}</h3>
                              </div>
                              <div className="flex flex-col flex-nowrap space-y-4">
                                <button
                                  type="button"
                                  className="bg-green-400 text-gray-900 h-12 w-32 rounded-md transform hover:scale-105 focus:outline-none"
                                  onClick={() => {
                                    // dispatch previous state to be pushed to present
                                    dispatchPosts({
                                      type: "TIME_TRAVEL",
                                      payload: {
                                        pastState: latestState,
                                      },
                                    });
                                  }}
                                >
                                  Time Travel
                                </button>
                              </div>
                            </li>
                          );
                        }
                      })}
                    </React.Fragment>
                  );
                }
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
