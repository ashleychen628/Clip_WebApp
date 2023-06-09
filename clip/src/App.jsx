import { Route, Routes, Link } from "react-router-dom"
import Home from "./Home"
import Classify from "./Classify"

export default function App() {
    let setName = "hi"
    return (
        <div>
            {/* <button className="export"><Link to={`/export/${setName}`}>Export</Link></button> */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/export/:setName" element={<Classify />} />
    </Routes>
            </div>
  )
}