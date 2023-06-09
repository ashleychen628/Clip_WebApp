import './Descriptions.css';
import React from "react";
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { registerLicense } from '@syncfusion/ej2-base';
import "../node_modules/@syncfusion/ej2-icons/styles/material.css";

registerLicense('Mgo+DSMBaFt+QHJqVk1nQ1NbdF9AXnNPdFJ3T2FQbz4Nf1dGYl9RQnZdQ1ViS3pbcUdmUA==;Mgo+DSMBPh8sVXJ1S0R+X1pDaV1dX2NLfUNwT2JYdVx5ZDU7a15RRnVfRF1hSHZSdEFrXntdeQ==;ORg4AjUWIQA/Gnt2VFhiQlJPcUBAQmFJfFBmQ2lYflRyfUUmHVdTRHRcQltjS39bd0dnUXhbeX0=;MjI5NzEyOUAzMjMxMmUzMDJlMzBvQkt6b3ZpRXhNb2NySHFUb3ZmY3U1MytWSGxiR2NZWkFSbi83cUx1aWNNPQ==;MjI5NzEzMEAzMjMxMmUzMDJlMzBUa0t3aGJLcy9XT2Fqem4vZGZyOTU5YloxR1cxQWtOUUVmY1VlK2o0eHlvPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfVhdX3xLflF1VWVTfl96dlxWACFaRnZdQV1lSXxSfkRhXXdWc3Nc;MjI5NzEzMkAzMjMxMmUzMDJlMzBkK0NvbkNGNmFoVlBJMEk2R2xveFFQb1hYUHdZbWhRMHc2enFQRTB5NytJPQ==;MjI5NzEzM0AzMjMxMmUzMDJlMzBDRFVnTDZINHRnUzlTWnk0czBKMGMvbGNucE1sVDhvZGNIZGF1MS9lSWV3PQ==;Mgo+DSMBMAY9C3t2VFhiQlJPcUBAQmFJfFBmQ2lYflRyfUUmHVdTRHRcQltjS39bd0dnUXZeeH0=;MjI5NzEzNUAzMjMxMmUzMDJlMzBvOEUrS2ZFMUxsMy9ZNHorZ20yckNYWEw4ekJIWHo0MzcxcFVuTXMyWWRrPQ==;MjI5NzEzNkAzMjMxMmUzMDJlMzBFbEttQ2xLL1RuVFUwWGF3UTNqU1lRbWZlWE1wZmhxRTdDZmZ1MmtYQ0JZPQ==;MjI5NzEzN0AzMjMxMmUzMDJlMzBkK0NvbkNGNmFoVlBJMEk2R2xveFFQb1hYUHdZbWhRMHc2enFQRTB5NytJPQ==');
class Descriptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        newDescription: "",
        keep_id: 0
    };
    
    this.handleDeleteDes = this.handleDeleteDes.bind(this);
    this.listTemplate = this.listTemplate.bind(this);
    this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
    this.handleAddDescription = this.handleAddDescription.bind(this);
    this.noDuplicateButton = this.noDuplicateButton.bind(this);
    this.listviewInstance = null;
    this.newDescription = React.createRef();
  }

  handleDeleteDes(args) {
    args.stopPropagation();
    let liItem = args.target.closest('li');
    let text = args.target.parentElement.innerText;
    // console.log(liItem )
    this.listviewInstance.removeItem(liItem);
    this.props.dltDescription(text);
  } 

  listTemplate(data) {
    // console.log(data.id)
    return (
      <div className="e-list-item">
        <h>{data.text}</h>
        <span className="e-icons e-delete-1" onClick={this.handleDeleteDes.bind(this)}/>
      </div>
    );
  }

  handleDescriptionInput(e) {
    e.preventDefault();
    this.setState({ newDescription: e.target.value });
  }

  handleAddDescription(e) {
    e.preventDefault();

    const current_idx = this.state.keep_id;
    const newDescription = this.state.newDescription; 
    // console.log(this.newDescription.value)
    let data = {
      text: newDescription,
      id: current_idx
    }
    this.props.setDescriptions(data);
    this.listviewInstance.addItem([data]);
    this.setState(prevState => ({
      keep_id: prevState.keep_id + 1
    }))
    
    e.target.reset();
  }

  noDuplicateButton() {
      if (this.props.descriptions.find((el) => el.text === this.state.newDescription)) {
      return <button className="bt_add" disabled={true}>add</button>
    }
      return <button className="bt_add">add</button>
  }
 
  render() {
    let fields = { text: "text", iconCss: "iconCss" };
    
    return (
      <div>
        <div className='display_description'>
          <ListViewComponent id="e-listview" dataSource={this.props.descriptions} fields={fields}
            template={this.listTemplate.bind(this)} ref={listview => {
                this.listviewInstance = listview;
            }}/>
        </div>

        <div className='add_description'>
          <form onSubmit={(e) => { this.handleAddDescription(e) }}>
                  <input id="newDes" type="text" placeholder="Enter your descriptions..."
                      onChange={(e) => { this.handleDescriptionInput(e) }} required />
                {this.noDuplicateButton()}
          </form>
        </div>

        <button onClick={(e) => {this.props.handleClearAll(e)}}>Clear All Descriptions</button>

    </div>);
  }
}

export default Descriptions;