import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import request from 'superagent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodList1: [],
      foodList2: [],
      queryString: ""
    }
  }

  componentDidMount() {
  }

  fetchData(term, id) {
    // We will hit this type of urls
    // https://api.nal.usda.gov/ndb/search/?format=json&q=pizza&sort=n&max=10&offset=0&api_key=DEMO_KEY&ds=Standard%20Reference

    var self = this;
    request
    .get('https://api.nal.usda.gov/ndb/search/')
    .query({q: term, format: 'json', max: '5', offset:'0', api_key: 'XCa9uB1lcp32KBK0ItR3IBrFRKWTvQhIdBJz7g67', ds: 'Standard Reference'})
    .end(function (err, response){
      if (err) {
        console.error('An error occured in the api call', err);
        return;
      }
      // console.log('Response is', response.body.list.item);
      if (response.body.list !== undefined)
        id === 'f1sb'
          ? self.setState({foodList1: response.body.list.item})
          : self.setState({foodList2: response.body.list.item})
    });
  }

  getNamesFromResponse(arr) {
    return arr.map((result) => (result.name));
  }

  getSearchResults(id) {
    if (id === 'f1sb') {
      let x = document.getElementById(id).value || "";
      console.log('Querying ', id);

      if (x.length > 3) {
        this.setState({queryString1: x});
        this.fetchData(x, id);
      }
    } else if (id === 'f2sb') {
      let x = document.getElementById(id).value || "";
      console.log('Querying ', id);

      if (x.length > 3) {
        this.setState({queryString2: x});
        this.fetchData(x, id);
      }
    }
  }

  render() {

    return (
      <div className="App">

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>What To Eat ??</h2>
        </div>

        <div className="App-intro">

          <div className="IntroLine">
            Please search and select the foods to compare :
          </div>

          <div className="FoodList">
            <form>
              Food  1 :
              <input
                type="text"
                id="f1sb"
                onKeyUp={this.getSearchResults.bind(this, 'f1sb')} />
            </form>
            <List
              foodList={this.getNamesFromResponse(this.state.foodList1)} />
          </div>

          <div  className="FoodList">
            <form>
              Food  2 :
              <input
                type="text"
                id="f2sb"
                onKeyUp={this.getSearchResults.bind(this, 'f2sb')} />
            </form>
            <List
              foodList={this.getNamesFromResponse(this.state.foodList2)} />
          </div>

        </div>
      </div>
    );
  }
}

class List extends Component {
  render() {
    let data = this.props.foodList;
    return (
      <ul>
        {
          data.map((value, index) => (<li key={index}><button>{value}</button></li>))
        }
      </ul>
    );
  }
}

export default App;