import React from "react";
import Pagination from "./Pagination";
import MyPosts from "./MyPost";
import LoguiDataStore from "../../stores/LoguiDataStore";

export default class MyLoguiData extends React.Component {
    constructor() {
        super();
        const posts = [];
        const postsPerPage = 5000;
        const currentPage = 1;
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        // const currentPosts = LoguiDataStore.getData(0, postsPerPage);

      
        this.state = {
            posts: posts,
            loading: false,
            currentPage: currentPage,
            postsPerPage: postsPerPage,
            indexOfLastPost: indexOfLastPost,
            indexOfFirstPost: indexOfFirstPost,
            currentPosts: currentPosts,
            paginate: null,
            totalNumber: 100000,
        };

        // this.init();
    }


    async updatePosts(currentPosts, pageNumber) {
        let posts = await currentPosts.json();
        posts = await JSON.parse(posts["results"]);
        console.log('SETTINGG...');
        this.setState({
            currentPosts: posts,
            posts: posts,
            currentPage: pageNumber,
        })
    }

    async componentDidMount() {
        console.log("DIDMOUNT");
        let paginate = async (pageNumber) => {
            let currentPage = pageNumber;
            let x = (pageNumber - 1) * this.state.postsPerPage;
            let currentPosts = await LoguiDataStore.getData(
                x,
                this.state.postsPerPage
            );
            let posts = await currentPosts.json();
            posts = await JSON.parse(posts["results"]);
            // this.updatePosts(currentPosts, currentPage)
            this.state.currentPosts = posts
            this.state.posts = posts
            this.state.currentPage = pageNumber
        };
        // const currentPosts = await LoguiDataStore.getData(
            // (this.state.pageNumber - 1) * this.state.postsPerPage,
        //     this.state.postsPerPage
        // );
        const currentPosts = await LoguiDataStore.getData(
            0,
            this.state.postsPerPage
        );
        let posts = await currentPosts.json();
        posts = await JSON.parse(posts["results"]);
        console.log("currentlpas", posts);
        // const currentPage = this.state.currentPage;

        this.setState({
            posts: posts,
            currentPosts: posts,
            // paginate: paginate,
            currentPage: 0,
        });
    }


    componentWillMount() {
        LoguiDataStore.on("change", (totalNumber) => {
            this.setState({
                posts: LoguiDataStore.loguiData,
                // });
                // this.setState({
                indexOfLastPost:
                    this.state.currentPage * this.state.postsPerPage,
                indexOfFirstPost:
                    this.state.indexOfLastPost - this.state.postsPerPage,
                currentPosts: JSON.parse(JSON.stringify(this.state.posts)),
                // });

                // this.setState({
                totalNumber: totalNumber,
            });

            // this.render();
        });

        // LoguiDataStore.on("change_n", (resultsPerPage) => {
        //   this.setState({
        //     postsPerPage: resultsPerPage,
        //   });

        //   this.render();
        // });
    }

    pageNumber() {
        let select = document.getElementById("resultsPerPage");
        let value = select.options[select.selectedIndex].value;

        LoguiDataStore.getData(
            this.state.currentPage - 1,
            this.state.postsPerPage
        );
        select.value = value;
        console.log("pageNum: " + this.state.postsPerPage);
    }

    render() {
        console.log("this.state.currentposts", this.state.currentPosts);
        if (this.state.currentPosts) {
            return (
                <div>
                    <div className="loguicontent">
                        <h1>LogUI data view</h1>
                        <MyPosts
                            posts={this.state.currentPosts}
                            loading={this.state.loading}
                            config={this.state.config}
                        />
                        <br />
                        <Pagination
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={this.state.totalNumber}
                            paginate={this.state.paginate}
                            currentPage={this.state.currentPage}
                        />
                        <br />

                        <p>Results per page:</p>
                        <select
                            name="resultsPerPage"
                            id="resultsPerPage"
                            onChange={this.pageNumber.bind(this)}
                            value={this.state.postsPerPage}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
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
