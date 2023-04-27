import React from "react";

// import ClassClick from "./ClassClick";

import "../App.css";

const Posts = ({ posts, loading, config }) => {
    if (loading) {
        return <h2>Loading..</h2>;
    }

    // console.log("posts.num: " + posts.length);

    return (
        <table>
            <tr className="logui_tr">
                <th className="logui_th">#</th>

                <th className="logui_th">User_Id</th>

                <th className="logui_th">Type</th>

                <th className="logui_th">Tracking_Type</th>

                <th className="logui_th">Details</th>

                <th className="logui_th">Timestamp</th>
            </tr>

            {posts.map((post) => (
                <tr>
                    <td className="logui_td logui_td_id">{post["id"]}</td>

                    <td className="logui_td">{post["user_id"]}</td>

                    <td className="logui_td">{post["type"]}</td>

                    <td className="logui_td">{post["tracking_type"]}</td>

                    <td className="logui_td_sp">
                        {JSON.stringify(post["details"])}
                    </td>

                    <td className="logui_td_sp">{post["time_stamp"]}</td>
                </tr>
            ))}
        </table>
    );
};

export default Posts;
