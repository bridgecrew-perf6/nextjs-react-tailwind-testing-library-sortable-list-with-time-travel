import { useState, useEffect, useContext, useRef } from "react";
import { fetchPosts } from "../api/fetchPosts";
import { PostsContext } from "../components/globalState";
import LoaderImage from "../assets/bars.svg";
import { useSprings, animated } from "react-spring";

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  // get past and present arrays and dispatchPosts fn from context
  const {
    Posts: { Present, Past },
    dispatchPosts,
  } = useContext(PostsContext);

  // Store indices as a local ref, this represents the item order
  const pastArrayOrder = useRef(Present.map((_, index) => index));

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
      })
      // catch error
      .catch((error) => {
        alert(error);
        // finish loading
        setLoading(false);
      });
  }, []);

  // move list items up or down
  const moveListItem = (direction, current_index) => {
    // Update springs animation with new props
    setSprings(updateSprings(current_index));

    if (direction === "UP") {
      // dispatch action MOVE_UP_AND_DOWN with new index less with one
      return dispatchPosts({
        type: "MOVE_UP_AND_DOWN",
        payload: { index1: current_index, index2: current_index - 1 },
      });
    }

    // dispatch action MOVE_UP_AND_DOWN with new index more with one
    return dispatchPosts({
      type: "MOVE_UP_AND_DOWN",
      payload: { index1: current_index, index2: current_index + 1 },
    });
  };

  // determines which items are animated
  const updateSprings = (originalIndex) => (index) =>
    index === originalIndex
      ? {
          opacity: 1,
          scale: 1,
          transform: "translate3d(0,0px,0)",
          shadow: 1,
          from: {
            opacity: 0,
            scale: 0.9,
            transform: "translate3d(0,-40px,0)",
            shadow: 15,
          },
        }
      : {
          opacity: 1,
          scale: 1,
          transform: "translate3d(0,0px,0)",
          shadow: 1,
        };

  // set springs animation on list items
  const [springs, setSprings] = useSprings(
    Present.length,
    updateSprings(pastArrayOrder.current)
  );

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
              springs.map((props, index) => (
                <animated.li
                  key={Present[index].id}
                  className="flex flex-row flex-nowrap justify-between w-full h-20 items-center p-2 text-gray-600 bg-white rounded-md shadow-xl"
                  style={props}
                >
                  <div>
                    <h3>{`${Present[index].id}: ${Present[index].title}`}</h3>
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
                </animated.li>
              ))
            )}
          </ul>
        </div>
        {/* actions list */}
        <div className="flex flex-col w-11/12 md:w-5/12 mx-auto md:mx-0 bg-gray-100 rounded-md shadow-2xl h-5/6">
          <div className="flex flex-col flex-nowrap mx-auto md:mx-0 md:w-10/12 md:ml-6">
            <h3 className="text-xl text-gray-600 font-semibold mt-4">
              List of actions committed
            </h3>
            <h6 className="text-sm text-gray-500">
              Ordered from latest to first
            </h6>
          </div>

          <ul className="flex flex-col flex-nowrap space-y-1 mt-8 py-0 px-0 md:py-8 md:px-2 bg-gray-200 min-h-24 max-h-96 overflow-y-scroll">
            {/* the order of Past array is oldest actions(index 0) to latest actions(index Past.length-1) */}
            {/* compare last item pushed to Past array (index Past.length-1) */}
            {/* which is the immediate former 'present array' */}
            {/* with current Present Array */}
            {/* check if Past array has at least an entry and the entry is not empty */}
            {Past?.[Past.length - 1]?.length &&
              // return only one item for the possible 2 when you swap array indices
              // e.g if you move index 0 to index 1 you also move index 1 to index 0
              [
                // find() returns the first item that matches a condition
                Past[Past.length - 1].find(
                  // if item at current index in Present (Present[index])
                  // is not the same as item in the same index in Past (Past[Past.length -1][index])
                  // mark as changed
                  (immediateLatest, index) =>
                    immediateLatest.id !== Present[index]["id"]
                ),
              ].map((immediateLatest) => (
                <li
                  key={immediateLatest.id}
                  className="flex flex-row flex-nowrap justify-between items-center w-full md:w-11/12 mx-auto h-20 p-2 text-gray-500 bg-white rounded-md shadow-xl"
                >
                  <div>
                    {/* moved from current index in Past array to index of the same item in the Present array */}
                    <h3>{`moved post ${immediateLatest.id} from index ${Past[
                      Past.length - 1
                    ].findIndex(
                      (entry) => entry.id === immediateLatest.id
                    )} to index ${Present.findIndex(
                      (entry) => entry.id === immediateLatest.id
                    )}`}</h3>
                  </div>
                  <div className="flex flex-col flex-nowrap space-y-4">
                    <button
                      type="button"
                      className="bg-green-400 text-gray-900 h-12 w-32 rounded-md transform hover:scale-105 focus:outline-none"
                      onClick={() => {
                        // time travel button
                        // dispatches previous state (in Past) to be pushed to Present

                        // Update springs animation with new props
                        setSprings(
                          updateSprings(
                            Past[Past.length - 1].findIndex(
                              (entry) => entry.id === immediateLatest.id
                            )
                          )
                        );

                        // Nb:
                        // The latest action is the last item in the Past array (Past[Past.length-1])
                        // and so it's index 0 in the reversed Past array (Past.reverse()[0])
                        dispatchPosts({
                          type: "TIME_TRAVEL",
                          payload: {
                            formerState: Past[Past.length - 1],
                            indexInReversePast: 0,
                          },
                        });
                      }}
                    >
                      Time Travel
                    </button>
                  </div>
                </li>
              ))}

            {/* compare former Past states against their subsequent ones (index-1) for older changes */}
            {/* Check if Past has at least two items and last item is not empty  */}
            {Past.length > 1 &&
              Past[Past.length - 1].length &&
              // reverse the array to map from the immediate latest states first before the older former states
              // Nb: Past array is ordered from oldest actions(index 0) to latest actions(index Past.length-1)
              // shallow copy instead of reversing original because reverse() mutates the original array
              [...Past].reverse().map((latestState, index) => {
                // don't map last item because no item +1 to compare against
                if (index !== Past.length - 1) {
                  return (
                    <React.Fragment key={index}>
                      {/* Nested maps because Past is an array of arrays */}
                      {
                        // return only one item for the possible 2 when you swap array indices
                        // e.g if you move index 0 to index 1 you also move index 1 to index 0
                        [
                          // find() returns the first item that matches a condition
                          latestState.find(
                            // if item at current index in Past[index]
                            // is not the same as item in the same index in Past[index-1] (Past[index+1] in reversed Past)
                            // mark as changed
                            (currentIndex, i) =>
                              currentIndex.id !==
                              [...Past].reverse()[index + 1]?.[i]?.["id"]
                          ),
                        ].map((currentIndex) => (
                          <li
                            key={currentIndex.id}
                            className="flex flex-row flex-nowrap justify-between items-center w-full md:w-11/12 mx-auto h-20 p-2 text-gray-500 bg-white rounded-md shadow-xl"
                          >
                            <div>
                              {/* moved from Past[index-1][currentIndex] to Past[index][findIndex(item at currentIndex)] */}
                              <h3>{`moved post ${currentIndex.id} from index ${[
                                ...Past,
                              ]
                                .reverse()
                                [index + 1].findIndex(
                                  (entry) => entry.id === currentIndex.id
                                )} to index ${[...Past]
                                .reverse()
                                [index].findIndex(
                                  (entry) => entry.id === currentIndex.id
                                )}`}</h3>
                            </div>
                            <div className="flex flex-col flex-nowrap space-y-4">
                              <button
                                type="button"
                                className="bg-green-400 text-gray-900 h-12 w-32 rounded-md transform hover:scale-105 focus:outline-none"
                                onClick={() => {
                                  // time travel button
                                  // dispatches previous state (in Past) to be pushed to Present

                                  // Update springs animation with new props
                                  setSprings(
                                    updateSprings(
                                      [...Past]
                                        .reverse()
                                        [index + 1].findIndex(
                                          (entry) =>
                                            entry.id === currentIndex.id
                                        )
                                    )
                                  );

                                  dispatchPosts({
                                    type: "TIME_TRAVEL",
                                    payload: {
                                      formerState: latestState,
                                      indexInReversePast: index,
                                    },
                                  });
                                }}
                              >
                                Time Travel
                              </button>
                            </div>
                          </li>
                        ))
                      }
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
