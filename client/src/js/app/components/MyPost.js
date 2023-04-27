import React from "react";
import ReactDataGrid from "react-data-grid";

// import ClassClick from "./ClassClick";
import "../App.css";

const MyPosts = ({ posts, loading, config }) => {
    console.log("POSTS:", posts);
    if (loading) {
        return <h2>Loading..</h2>;
    }
    const defaultColumnProperties = {
        resizable: true,
        width: 240,
    };
    const columns = [
        { key: "QID", name: "QID" },
        { key: "eventDetailsName", name: "Event Name" },
        { key: "eventDetailsTrackingDetails", name: "Event Type" },
        { key: "eventDetailsType", name: "Tracking" },
        { key: "eventType", name: "Track Type" },
        { key: "eventTimestamp", name: "Timestamp" },
        { key: "fullUrl", name: "URL" },
    ].map((c) => ({ ...c, ...defaultColumnProperties }));

    const rowGetter = (rowNumber) => posts[rowNumber];
    const rowsCount = posts.length;

    // console.log("posts.num: " + posts.length);
    return (
        <ReactDataGrid
            columns={columns}
            rowGetter={rowGetter}
            rowsCount={rowsCount}
            minHeight={800}
            onColumnResize={(idx, width) =>
                console.log(`Column ${idx} has been resized to ${width}`)
            }
        />
    );

    // return (
    //     <table>
    //         <tr className="logui_tr">
    //             <th className="logui_th">QID</th>
    //             <th className="logui_th">event name</th>
    //             <th className="logui_th">event type</th>
    //             <th className="logui_th">tracking</th>
    //             <th className="logui_th">event Type</th>
    //             <th className="logui_th">Timestamp</th>
    //             <th className="logui_th">url</th>
    //         </tr>

    //         {posts.map((post) => (
    //             <tr>
    //                 <td className="logui_td logui_td_id">{post["QID"]}</td>
    //                 <td className="logui_td">{post["eventDetailsName"]}</td>
    //                 <td className="logui_td">{post["eventDetailsType"]}</td>
    //                 <td className="logui_td_sp">
    //                     {post["eventDetailsTrackingDetails"]}
    //                 </td>
    //                 <td className="logui_td">{post["eventType"]}</td>
    //                 <td className="logui_td">{post["eventTimestamp"]}</td>
    //                 <td className="logui_td">{post["fullUrl"]}</td>
    //             </tr>
    //         ))}
    //     </table>
    // );
};

export default MyPosts;
