export default function IndexPage() {
  let dataArray = [
    {
      id: 1,
      title:
        "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    },
    {
      id: 2,
      title: "qui est esse",
    },
    {
      id: 3,
      title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    },
    {
      id: 4,
      title: "eum et est occaecati",
    },
    {
      id: 5,
      title: "nesciunt quas odio",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
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
      {/* sortable post list */}
      <div className="flex flex-col w-4/12 ml-8 fixed top-6">
        <h3 className="text-xl text-white">Sortable Post List</h3>
        <ul className="flex flex-col flex-nowrap space-y-6 mt-4">
          {dataArray.map(({ id, title }, index) => (
            <li
              key={id}
              className="flex flex-row flex-nowrap justify-between w-full h-20 items-center p-2 text-gray-700 bg-white rounded-md shadow-xl"
            >
              <div>
                <h3>{`${id}: ${title}`}</h3>
              </div>
              <div className="flex flex-col flex-nowrap space-y-4">
                {index !== 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-purple-900 w-5 h-5 transform cursor-pointer hover:scale-125"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {index !== dataArray.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-purple-900 w-5 h-5 transform cursor-pointer hover:scale-125"
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
          ))}
        </ul>
      </div>
    </div>
  );
}
