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
      nutriData1: [],
      nutriData2: [],
      queryString1: "",
      queryString2: "",
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
  getNutriFacts(ndbno, number) {
    // 2 apis can be used
    // Using : https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=DEMO_KEY&nutrients=205&nutrients=204&ndbno=21263
    // Instead of : https://api.nal.usda.gov/ndb/reports/?ndbno=21473&type=b&format=json&api_key=DEMO_KEY

    // Nutrient Codes
    // 203 => protien
    // 291 => fibre
    // 606 => saturated fats
    // 601 => cholestrol
    var self = this;
    request
    .get('https://api.nal.usda.gov/ndb/nutrients/?nutrients=203&nutrients=291&nutrients=601&nutrients=606')
    .query({ndbno: ndbno, format: 'json', api_key: 'XCa9uB1lcp32KBK0ItR3IBrFRKWTvQhIdBJz7g67'})
    .end(function (err, response){
      if (err || !response.body) {
        console.error('Some error occured, please refresh the page');
      }
      if (number === '1')
        self.setState({ nutriData1: response.body.report.foods[0].nutrients });
      else if (number === '2')
        self.setState({ nutriData2: response.body.report.foods[0].nutrients });
    });
  }
  selectedItem(selectedFood, ndbno, number) {
    console.log('Selected Food Is', selectedFood);
    if (number === '1')
      this.setState({
        selectedFood1Name: selectedFood,
        selectedFood1NdbNo: ndbno
      }, function(){
        // console.log(this.state);
        this.getNutriFacts(ndbno, number);
      });
    else if (number === '2')
      this.setState({
        selectedFood2Name: selectedFood,
        selectedFood2NdbNo: ndbno
      }, function(){
        // console.log(this.state);
        this.getNutriFacts(ndbno, number);
      });
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
                className="FoodInput"
                onKeyUp={this.getSearchResults.bind(this, 'f1sb')} />
            </form>
            <List
              selectionHandler={this.selectedItem}
              reference={this}
              listNumber='1'
              foodList={this.state.foodList1} />

            <div className="SelectedFoodName">
              {this.state.selectedFood1Name}
            </div>

            <div>
            {
              this.state.nutriData1.map((value, index) => (
                <div key={index} className={value.nutrient_id === '291' || value.nutrient_id === '203' ? 'GoodNutri' : 'BadNutri'}>
                  <div className="Nutrient_Name">{value.nutrient}</div>
                  <div className="Nutrient_Value">{value.gm}</div>
                </div>
              ))
            }
            </div>
          </div>

          <div  className="FoodList">
            <form>
              Food  2 :
              <input
                type="text"
                id="f2sb"
                className="FoodInput"
                onKeyUp={this.getSearchResults.bind(this, 'f2sb')} />
            </form>
            <List
              selectionHandler={this.selectedItem}
              reference={this}
              listNumber='2'
              foodList={this.state.foodList2} />

            <div className="SelectedFoodName">
              {this.state.selectedFood2Name}
            </div>

            <div>
            {
              this.state.nutriData2.map((value, index) => (
                <div key={index} className={value.nutrient_id === '291' || value.nutrient_id === '203' ? 'GoodNutri' : 'BadNutri'}>
                  <div className="Nutrient_Name">{value.nutrient}</div>
                  <div className="Nutrient_Value">{value.gm}</div>
                </div>
              ))
            }
            </div>
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
      <div>
        {
          data.map((value, index) => (
            <a
              className="SearchOption"
              key={index}
              onClick={this.props.selectionHandler.bind(this.props.reference, value.name, value.ndbno ,this.props.listNumber)}>{value.name}
            </a>
          ))
        }
      </div>
    );
  }
}

export default App;
