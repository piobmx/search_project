import React from "react";
import Pagination from "./Pagination";
import MyMongoPost from "./MyMongoPost";

export default class MyMongoData extends React.Component {
    constructor() {
        super();
        const posts = [];
        const postsPerPage = 300;
        const currentPage = 1;
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

        let paginate = null;

        this.state = {
            posts: posts,
            loading: false,
            currentPage: currentPage,
            postsPerPage: postsPerPage,
            indexOfLastPost: indexOfLastPost,
            indexOfFirstPost: indexOfFirstPost,
            currentPosts: currentPosts,
            paginate: paginate,
        };

        // this.init();
    }

    async componentDidMount() {
        console.log('MONGOLOG');
        const url = process.env.REACT_APP_SERVER_URL + "/v1/mongolog/";
        const currentPosts = await fetch(url);

        let posts = await currentPosts.json();
        posts = await JSON.parse(posts["results"]);
        console.log("currentlpas", posts);

        this.setState({
            posts: posts,
            currentPosts: posts,
        });
    }


    render() {
        console.log("this.state.currentposts", this.state.currentPosts);
        if (this.state.currentPosts) {
            return (
                <div>
                    <div className="loguicontent">
                        <h1>LogUI data view (Mongo)</h1>
                        <MyMongoPost
                            posts={this.state.currentPosts}
                            loading={this.state.loading}
                            config={this.state.config}
                        />
                        <br />

                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>LogUI data view</h1>
                    <p>Loading...</p>
                </div>
            );
        }
    }
}
