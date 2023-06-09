import { Route, Routes} from "react-router-dom"
import Home from "./Home"
import Classify from "./Classify"

export default function App() {
    return (         
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/export/:setName" element={<Classify />} />
      </Routes>
  )
}