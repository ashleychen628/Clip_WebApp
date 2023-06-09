import React from "react";
import './UploadDisplayImage.css';
import { ListViewComponent } from "@syncfusion/ej2-react-lists";



class UploadDisplayImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageNames: [],
            chooseFile: [],
            imageList: []
        }
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.listTemplate = this.listTemplate.bind(this);
        this.handleDeleteDes = this.handleDeleteDes.bind(this);
        this.listviewInstance = null;
        this.handleClearAllImg = this.handleClearAllImg.bind(this);
    }

    listTemplate(data) {
        let img = data.text;
        let index = data.index;
        // Upload images for choosing classifier
        if (this.props.classification === false) {
            let labelProbs = this.props.labelProbs
            var res = ""
            if (this.props.labelProbs.length > 0) {
                this.props.descriptions.map((el, id) => {
                    res = res + el["text"] + ": " + labelProbs[index][id] + ", ";
                })
            }

            return (
                <div className="e-list-item" id={img}>
                    <img src={img} alt="img" />
                    <span className="e-icons e-delete-1" onClick={this.handleDeleteDes.bind(this)} />
                    <span>  {this.props.labelProbs.length > 0 && <p>{res}</p>} </span>
                </div>
            );
        }
        // Upload images for classification (run inference)
        else {
            return (
                <div className="e-list-item" id={img}>
                    <img src={img} alt="img" />
                    <span className="e-icons e-delete-1" onClick={this.handleDeleteDes.bind(this)} />
                </div>
            );
        }
    }

    handleDeleteDes(args) {
        args.stopPropagation();
        let liItem = args.target.closest('li');
        let name = args.target.parentElement.id.split("/").pop()
        name = name.split(".")[0] + "." + name.split(".")[2]

        const imgName = { "imgName": name};

        fetch('http://127.0.0.1:5000/deleteImage', {
            method: "POST",
            body: JSON.stringify(imgName),
            headers:{'Content-Type': 'application/json'}
        })
        .then((response) => {
            response.json()
                .then((body) => {
                    console.log(body)
                })
        });
        this.listviewInstance.removeItem(liItem);

    } 

    handleUploadImage(e) {
        e.preventDefault();
        const data = new FormData();
        let files = this.uploadInput.files;
   
        for (var i = 0; i < files.length; i++){
            data.append('files[]', files[i]);
        }
       
        fetch('http://127.0.0.1:5000/uploadImage', {
            method: 'POST',
            body: data,
        })
        .then((response) => {
            response.json()
                .then((body) => {
                    console.log(body["filenames"])
                    this.setState({ imageNames: body["filenames"] });
                })
        });
        
    }

    handleClearAllImg(e) {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/deleteAllImage', {
            method: "POST"
        })
        .then((response) => {
            response.json()
                .then((body) => {
                    console.log(body)
                })
        });

    }

    importAll(r) {
        return r.keys().map(r);
    }

    componentDidMount() {
        const l = this.importAll
            (require.context('./uploaded_Images/calc_probabilities/', false, /\.(png|jpe?g|svg)$/))
        
        if (l.length !== 0) {
            let imgList = l.map((el, index) => {
                return ({ "text": el, "index": index });
            });
  
            this.setState({
                imageList: imgList
            });

        }

        this.props.setImageList(l.length)
        
    }

    render() {
        let fields = { text: "text", iconCss: "iconCss" };
        
        return (
            <div className="UploadDisplayImage">
                <form onSubmit={this.handleUploadImage}>
                    <div>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" name="file[]" multiple />
                    </div>
                    <br />
                    <div>
                        {
                            this.state.imageNames !== [] ?
                                <button type="submit">Upload</button>
                                :
                                <button type="submit" disabled={true}>Upload</button>
                        }
                    
                    </div>
                    
                </form>

                <button onClick={(e) => {this.handleClearAllImg(e)}}>Clear All Images</button>
                
                <div>
                    <ListViewComponent id="e-listview" dataSource={this.state.imageList} fields={fields}
                        template={this.listTemplate.bind(this)} ref={listview => {
                            this.listviewInstance = listview;
                            }} />
                </div>

            </div>
        );
    }
}

export default UploadDisplayImage;