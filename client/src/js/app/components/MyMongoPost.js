import React from "react";
import ReactDataGrid from "react-data-grid";

// import ClassClick from "./ClassClick";
import "../App.css";

const MyMongoPost = ({ posts, loading, config }) => {
    console.log("MONGO POSTS:", posts);
    if (loading) {
        return <h2>Loading..</h2>;
    }
    const defaultColumnProperties = {
        resizable: true,
        width: 240,
    };
    const columns = [
        { key: "userId", name: "QID" },
        { key: "date", name: "Date" },
        { key: "event", name: "Event" },
        { key: "vertical", name: "Verical" },
        { key: "indexstance", name: "Index X Stance" },
        { key: "mouse", name: "MouseType"},
        { key: "query", name: "Query" },
        { key: "page", name: "Page"},
        { key: "topic", name: "Topic"},
        { key: "biastype", name: "BiasType"},
        { key: "viewpoint", name: "ViewPoint"},
    ].map((c) => ({ ...c, ...defaultColumnProperties }));

    const rowGetter = (rowNumber) => {
        let row = posts[rowNumber];
        if (!row) {
            return undefined;
        }
        row["query"] = row["meta"]["query"];
        row["vertical"] = row["meta"]["vertical"];
        let ind = row["meta"]["index"];
        let stance = row["meta"]["stance"];
        row["indexstance"] = `${ind}x${stance}`;
        row["page"] = row["meta"]["page"];
        row["topic"] = row["meta"]["topic"];
        row["viewpoint"] = row["meta"]["viewpoint"];
        row["biastype"] = row["meta"]["biasType"];
        row["mouse"] = row["meta"]["mouse"];
        return row;
    };
    const rowsCount = 1000;
    // const RowRenderer = ({ row, idx }) => {
    //     const { firstName, lastName } = row;
    //     return `query: ${row['meta']['query']}`;
    //   };

    // console.log("posts.num: " + posts.length);
    return (
        <ReactDataGrid
            columns={columns}
            rowGetter={rowGetter}
            rowsCount={rowsCount}
            // rowRenderer={RowRenderer}
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

export default MyMongoPost;
