import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import PostsList from './PostsList';
import AddPost from './AddPost';
import SearchPosts from './SearchPosts';
import 'whatwg-fetch';

class PostsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalData: [],
      filteredData: []
    };

    this.getPosts();
    this.searchPost = this.searchPost.bind(this);
    this.onPostSave = this.onPostSave.bind(this);
  }

  getPosts() {
    fetch('http://jsonplaceholder.typicode.com/posts')
      .then((data) => data.json())
      .then((json) => {
        let jsonReversed = json.reverse();
        this.setState({
          originalData: jsonReversed,
          filteredData: jsonReversed.slice()
        })
      })
  }

  searchPost(event) {
    let inputValue = event.target.value;
    let highlightRegExp = new RegExp("("+inputValue+")", "gi");
    let filteredData = this.state.originalData
      .filter((post) => post.title.indexOf(inputValue) > -1)
      .map((post) => {return {
        ...post,
        title: post.title
          .split(highlightRegExp)
          .map((titlePart, idx) =>
            <span key={idx} className={ titlePart === inputValue ? "highlight" : ""}>{titlePart}</span>
          )
      }});

    this.setState({
      filteredData: filteredData
    })
  }

  onPostSave(title, body){
    let newID = this.state.originalData[this.state.originalData.length - 1].id + 1;
    let newRecord = {id: newID, userId: 1, title: title, body: body};

    this.setState({
      originalData: [
        {...newRecord},
        ...this.state.originalData
      ],
      filteredData: [
        {...newRecord},
        ...this.state.filteredData
      ]
    })
  }

  render() {
    return (
      <div className="posts">
        <Row>
          <Col xs={12} sm={3}>
            <SearchPosts onChange={this.searchPost} />
          </Col>
          <Col xs={12} sm={9} className="text-right">
            <AddPost onSave={this.onPostSave} />
          </Col>
        </Row>
        <PostsList data={this.state.filteredData} />
      </div>
    );
  }
}

export default PostsContainer;
