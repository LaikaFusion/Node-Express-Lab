import React, { Component } from 'react';
import './App.css';
const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      display:[{}]
    }
  }
  
  getData = ()=>{
    axios.get('http://localhost:8000/api/posts')
    .then(response=> {
      // handle success
      this.setState(
        {display:response.data}
      )
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }
  deleteFriend = (id) => {
    axios
      .delete(`http://localhost:8000/api/posts/${id}`)
      .then(response => {
        this.getData()
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentDidMount =()=>{
    this.getData();
  }
  render() {
    return (
      <div className="App">
        {this.state.display.map((e,i)=>{
          return (<div   className='friendListRow' id={e.id} key={i} to={`/friend/${e.id}`}>
       
          <div className='friendsListItem'>
          {e.title}
          </div>
          <div className='friendsListItem'>
          {e.contents}
          </div>
          
         <button onClick={()=>{this.deleteFriend(i)}}> Delete</button>
          </div>
       )
          
          
        })}
        
      </div>
    );
  }
}

export default App;
