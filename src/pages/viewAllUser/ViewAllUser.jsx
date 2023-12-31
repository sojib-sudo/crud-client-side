import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import "./viewAllUser.css";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Loading from "../../components/loading/Loading";

const ViewAllUser = () => {
  const [items, setItems] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const [singleUser, setSingleUser] = useState([]);

  //modal
  const [modal, setModal] = useState(false);

  const getSIngleUser = (id) => {
    fetch(`https://crud-server-side-seven.vercel.app/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setSingleUser(data));
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(
        "https://crud-server-side-seven.vercel.app/api/users"
      );
      const users = await res.json();
      setItems(users);
      return users;
    },
  });

  // for delete
  const handleDelete = (id) => {
    fetch(`https://crud-server-side-seven.vercel.app/api/user/${id}`, {
      method: "DELETE",
      headers: {
        //authorization: `bearer ${localStorage.getItem('accessToken')}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          refetch();
          setModal(false);
          toast.success(`Deleted successfully`);
        }
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const itemsPerPage = 4;
  const endOffset = itemOffset + itemsPerPage;
  // console.log(typeof(itemOffset), typeof(endOffset))

  const currentItems = items?.slice(itemOffset, endOffset);
  const pageCount = Math?.ceil(items?.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event?.selected * itemsPerPage) % items?.length;
    console.log(
      `User requested page number ${event?.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div className="flex flex-col  mt-[40px] items-center justify-center ">
      <p className="text-2xl font-semibold">All Users</p>
      <div className="mt-5">
        <section className="container px-4 mx-auto ">
          <div className="inline-block min-w-[80pw] mx-auto py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr className="text-center">
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      ID
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Image
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {currentItems?.length === 0 ? (
                    <p className="px-[15px] py-[5px]">
                      No user avilabe. Please add user
                    </p>
                  ) : (
                    currentItems?.map((user, i) => (
                      <tr onClick={() => getSIngleUser(user?._id)} key={i}>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {i + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img src={user?.img} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {user?.name}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <Link to={`/view-details/${user?._id}`}>
                            <button className=" mt-[10px] btn-info text-white px-[20px] text-[16px] py-[2px] rounded-[4px]">
                              View
                            </button>
                          </Link>
                          <Link to={`/update-user/${user?._id}`}>
                            <button className="ml-[20px] mt-[10px] btn-primary text-white px-[20px] text-[16px] py-[2px] rounded-[4px]">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => setModal(true)}
                            className="ml-[20px] mt-[10px] btn-secondary  text-white px-[20px] text-[16px] py-[2px] rounded-[4px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {modal && (
                <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
                  <div className="bg-white px-16 py-14 rounded-md text-center">
                    <h1 className="text-xl mb-4 font-bold text-slate-500">
                      Do you Want Delete
                    </h1>
                    <button
                      onClick={() => setModal(false)}
                      className=" bg-indigo-500 px-4 py-2 rounded-md text-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(singleUser?._id)}
                      className=" bg-red-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pagination">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName="pagination-menu"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewAllUser;
