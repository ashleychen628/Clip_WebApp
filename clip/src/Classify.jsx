import React, {useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";
import UploadDisplayImage from "./UploadDisplayImage";

export default function Classify(props) {
    const urlParameters = useParams();
    let setName = urlParameters.setName;

    const [description, setDes] = useState();
    const [isPending, setIsPending] = useState(true);
    const [resImage, setResImage] = useState();
    // const [hasImage, setHasImage] = useState(0);
    const [disableBt, SetDisableBt] = useState(false);
    
    // let hasImage = 0;
    
    useEffect(() => {
        fetch('http://127.0.0.1:5000/getDescriptions/' + setName)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setDes(data.descriptions);
                setIsPending(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function displayDescription() {
        const showDes = []
        let desList = description
        desList.map((des, el) => {
        showDes.push(
            <tr id="each description" key={el}>
                <td key={el}>
                    <h>{des}</h>
                </td>
            </tr>
        )
        })

        return showDes
    }

    function handleClassify(e) {
        fetch('http://127.0.0.1:5000/classify/' + setName)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setResImage(data.classify_location)
            })
    }

    function setImageList(num) {
        if (num === 0) {
            SetDisableBt(true);
        }
        else {
            SetDisableBt(false);
        }
    
    }

    return (
        // <ClassifyImg setName={setName} descriptions={description} />
        
        <div className="Classification">    

            <div className="Description_section">
                <p>Descriptions set: {setName}</p>
                <tbody>
                    {!isPending && resImage === undefined && displayDescription()}
                </tbody>
            </div>
            
            <div className='Image_section'>
                {
                    resImage === undefined ?
                        <UploadDisplayImage classification={true} setImageList={(num) => setImageList(num)} />
                        :
                        <img src={require(`./result_Images/classify_Images/${setName}.png`)} alt="img" />
                }
            </div>
            <div className="view_c_result">
                <button onClick={(e) => { handleClassify(e) }} disabled={disableBt}>View Classification Result</button>
            </div>
            <button className="back"><Link to={`/`}>Back</Link></button>
        </div>
    )
}
 