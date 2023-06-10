import './Home.css';
import React from "react";
import UploadDisplayImage from "./UploadDisplayImage";
import Descriptions from "./Descriptions";
import { registerLicense } from '@syncfusion/ej2-base';
import "../node_modules/@syncfusion/ej2-icons/styles/material.css";
import { Link } from "react-router-dom";


registerLicense('Mgo+DSMBaFt+QHJqVk1nQ1NbdF9AXnNPdFJ3T2FQbz4Nf1dGYl9RQnZdQ1ViS3pbcUdmUA==;Mgo+DSMBPh8sVXJ1S0R+X1pDaV1dX2NLfUNwT2JYdVx5ZDU7a15RRnVfRF1hSHZSdEFrXntdeQ==;ORg4AjUWIQA/Gnt2VFhiQlJPcUBAQmFJfFBmQ2lYflRyfUUmHVdTRHRcQltjS39bd0dnUXhbeX0=;MjI5NzEyOUAzMjMxMmUzMDJlMzBvQkt6b3ZpRXhNb2NySHFUb3ZmY3U1MytWSGxiR2NZWkFSbi83cUx1aWNNPQ==;MjI5NzEzMEAzMjMxMmUzMDJlMzBUa0t3aGJLcy9XT2Fqem4vZGZyOTU5YloxR1cxQWtOUUVmY1VlK2o0eHlvPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfVhdX3xLflF1VWVTfl96dlxWACFaRnZdQV1lSXxSfkRhXXdWc3Nc;MjI5NzEzMkAzMjMxMmUzMDJlMzBkK0NvbkNGNmFoVlBJMEk2R2xveFFQb1hYUHdZbWhRMHc2enFQRTB5NytJPQ==;MjI5NzEzM0AzMjMxMmUzMDJlMzBDRFVnTDZINHRnUzlTWnk0czBKMGMvbGNucE1sVDhvZGNIZGF1MS9lSWV3PQ==;Mgo+DSMBMAY9C3t2VFhiQlJPcUBAQmFJfFBmQ2lYflRyfUUmHVdTRHRcQltjS39bd0dnUXZeeH0=;MjI5NzEzNUAzMjMxMmUzMDJlMzBvOEUrS2ZFMUxsMy9ZNHorZ20yckNYWEw4ekJIWHo0MzcxcFVuTXMyWWRrPQ==;MjI5NzEzNkAzMjMxMmUzMDJlMzBFbEttQ2xLL1RuVFUwWGF3UTNqU1lRbWZlWE1wZmhxRTdDZmZ1MmtYQ0JZPQ==;MjI5NzEzN0AzMjMxMmUzMDJlMzBkK0NvbkNGNmFoVlBJMEk2R2xveFFQb1hYUHdZbWhRMHc2enFQRTB5NytJPQ==');
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      descriptions: [
      { "text": "a page of text about segmentation", id: "0" },
      { "text": "a facial photo of a tabby cat", id: "1" },
      { "text": "a portrait of an astronaut with the American flag", id: "2" },
      { "text": "a rocket standing on a launchpad", id: "3" },
      { "text": "a red motorcycle standing in a garage", id: "4" },
      { "text": "a person looking at a camera on a tripod", id: "5" },
      { "text": "a black-and-white silhouette of a horse", id: "6" },
      { "text": "a cup of coffee on a saucer", id: "7"}
    ],

      resImage: "",
      setName: "",
      labelProbs: [],
      hasImage: 0,
      setList: [],
      newSetName: ""
    };

    this.setDescriptions = this.setDescriptions.bind(this);
    this.dltDescription = this.dltDescription.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleAddSet = this.handleAddSet.bind(this);
    this.setImageList = this.setImageList.bind(this);
    this.handleSetNameInput = this.handleSetNameInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.displayDescription = this.displayDescription.bind(this);
    this.handleDeleteSet = this.handleDeleteSet.bind(this);
    this.handleClickSet = this.handleClickSet.bind(this);
  }

  setImageList(num) {
    // console.log("called" + this.state.hasImage)
    this.setState({
      hasImage: num
    })
  }

  handleSetNameInput(e) {
    e.preventDefault();
    this.setState({ newSetName: e.target.value });
  }

  setDescriptions(data) {
    let setName = this.state.setName
    let labelProbs = this.state.labelProbs

    if (this.state.setName !== "") {
      setName = ""
      labelProbs = []
    }
    this.setState({
      descriptions: this.state.descriptions.concat(data),
      setName: setName,
      labelProbs: labelProbs,
    })
  }

  dltDescription(text) {
   
    let setName = this.state.setName
    let labelProbs = this.state.labelProbs
    console.log("delete des" + this.state.setList.length)

    if (this.state.setName !== "") {
      setName = ""
      labelProbs = []
    }
    // this.setState({
    //   descriptions: this.state.descriptions.filter(el => el.text !== text),
    //   setName: setName,
    //   labelProbs: labelProbs,
    //   setList: this.state.setList.filter(el => el !== setName)
    // })
    this.setState({
      descriptions: this.state.descriptions.filter(el => el.text !== text),
      setName: setName,
      labelProbs: labelProbs
    })
  }

  handleResult(e) {
    // change description format to {id: "text"}
    var setName = this.state.setName;

    // get calculation result from backend
    let probUrl = "http://127.0.0.1:5000/getProb/" + setName;

    fetch(probUrl, {
      method: "GET"
    })
    .then((res) => {
      res.json()
        .then((data) => {
          // console.log("result_location " + data["result_location"])
          this.setState({
            resImage: data["result_location"],
            labelProbs: data["label_probs"]
          });
        })
    });
  }

  handleAddSet(e) {
    e.preventDefault();

    let name = e.target.setName.value;

    this.setState(prevState => ({
      setName: name,
      setList: [...prevState.setList, name]
    }))

    var setName = name;
    let descriptions = this.state.descriptions;
    // console.log(this.state.resImage)
    const desDict = {};
    descriptions.forEach((el) => {
      desDict[el.id]= el.text;
    })

    const all_descriptions = { "des": desDict, "setName": setName };

    const headers_p = {
      'Content-Type': 'application/json'
    }
    fetch('http://127.0.0.1:5000/addDescriptions', {
      method: 'POST',
      headers: headers_p,
      body: JSON.stringify(all_descriptions),
    })
    .then((response) => {
      response.json()
        .then((body) => {
          console.log(body)
        })
    });
    e.target.reset()
  }

  handleClearAll(e) {
    e.preventDefault();
    
    console.log("clear all")
    this.setState({
      descriptions: []
    })
  }

  handleDeleteSet(setName) {

    const data = { "setName": setName };
    let name = this.state.setName;
    if (this.state.setName === setName) { name = ""; }

    fetch('http://127.0.0.1:5000/deleteSet', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json()
          .then((body) => {
              this.setState({
                setList: this.state.setList.filter(el => el !== setName),
                setName: name
              })
          })
      });
  }

  handleClickSet(setName) {
    
    fetch('http://127.0.0.1:5000/getSet/'+setName, {
      method: 'GET',
    })
      .then((response) => {
        response.json()
          .then((body) => {
            var des = []
            body["descriptions"].map((el, id) => (
                des.push({"text": el, "id": id.toString()})
            ))
            console.log(des)
              this.setState({
                descriptions: des,
                setName: setName
              })
          })
      });
  }

  componentDidMount() {
    // console.log("called")
    fetch('http://127.0.0.1:5000/getSetNames', {
      method: 'GET'
    })
      .then((response) => {
        response.json()
          .then((body) => {
            this.setState({
              setList: body["setNameList"]
            })
          })
      });
  }

  displayDescription() {
    const showSet = []
    
    let setList = this.state.setList;
      setList.map((setName, el) => (
      showSet.push(
          <tr id="each set name" key={el}>
              <td key={el}>
                <Link onClick={() => this.handleClickSet(setName)}>{setName}</Link>
                <span className="e-icons e-delete-1" onClick={() => this.handleDeleteSet(setName)}></span>
              </td>
          </tr>
      )
      ))

      return showSet
    }



  render() {
    let setName = this.state.setName;
    let duplicateName = false;
    // console.log("rendered" + this.state.descriptions.length)
    // console.log("set names: " + this.state.setList[0])
    if ((this.state.setList.length !== 0 && this.state.setList.includes(this.state.newSetName)) || this.state.descriptions.length < 5) { 
      duplicateName = true;
    }

    return (
      <div className='App'>
        <div className='Description_section'>
          <div className="des_title">
            <p>Descriptions: {this.state.setName}</p>
            <form onSubmit={(e) => { this.handleAddSet(e) }}>
              <input id="setName" type="text" placeholder="add a set" 
                  onChange={(e) => { this.handleSetNameInput(e) }} required/>
                <button className="bt_edit" type="submit" disabled={duplicateName}>Add Classifier Set</button>
            </form>
          </div>
          <Descriptions descriptions={this.state.descriptions} handleClearAll={this.handleClearAll.bind(this)}
            setDescriptions={this.setDescriptions.bind(this)} dltDescription={this.dltDescription.bind(this)}/>
          <br />
          <h>History</h>
          {this.displayDescription()}
        </div>

        <div className='Image_section'>
          <UploadDisplayImage labelProbs={this.state.labelProbs}
            descriptions={this.state.descriptions} classification={false} setImageList={this.setImageList.bind(this)} />
        </div>

        <div className="Result_section">
          {
            this.state.setName !== "" && this.state.hasImage !== 0 ?
              <button className="result" onClick={(e) => { this.handleResult(e) }}><p>View Results</p></button>
              :
              <button className="result" onClick={(e) => { this.handleResult(e) }} disabled={true}><p>View Results</p></button>
          }
          {/* <img src={require(`./result_Images/calc_probabilities/probabilities.png`)} alt="img" /> */}
        </div>

        <div className="Export_section">
          {
            this.state.setName !== "" && this.state.hasImage !== 0 ? 
              // <button className="export" onClick={()=>history.push(`/export/${setName}`)}><Link to={par}>Export</Link></button>
              <button className="export"><Link to={`export/${setName}`}>Export</Link></button>
              :
              <button className="export" disabled={true}>Export</button>
          }
          {/* <img src={require(`./result_Images/calc_probabilities/probabilities.png`)} alt="img" /> */}
        </div>

      </div>
    );
  }
}

export default Home;
