import { useState, useEffect, useContext } from "react";
import { fetchPosts } from "../api/fetchPosts";
import { PostsContext } from "../components/globalState";
import LoaderImage from "../assets/bars.svg";

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  // get data and dispatch from context
  const {
    Posts: { Present },
    dispatchPosts,
  } = useContext(PostsContext);

  let actionsArray = [
    {
      id: 1,
      title: "moved 1 to 2",
    },
    {
      id: 2,
      title: "moved 2 to 3",
    },
  ];

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
          <ul className="flex flex-col flex-nowrap space-y-1 mt-8 py-0 px-0 md:py-8 md:px-2 bg-gray-200">
            {actionsArray.map(({ id, title }, index) => (
              <li
                key={id}
                className="flex flex-row flex-nowrap justify-between items-center w-full md:w-11/12 mx-auto h-20 p-2 text-gray-500 bg-white rounded-md shadow-xl"
              >
                <div>
                  <h3>{title}</h3>
                </div>
                <div className="flex flex-col flex-nowrap space-y-4">
                  <button
                    type="button"
                    className="bg-green-400 text-gray-900 h-12 w-32 rounded-md transform hover:scale-105 focus:outline-none"
                  >
                    Time Travel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
