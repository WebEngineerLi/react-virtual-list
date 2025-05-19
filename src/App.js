import { Navigate, Route, Routes } from 'react-router-dom'
import VirtualList from "@/components/VirtualList";
import VirtualListV2 from "@/components/VirtualListV2";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route
          path="/virtual-list"
          element={<VirtualList />}
        />
        <Route
          path="/virtual-list-v2"
          element={<VirtualListV2 />}
        />
        <Route
          path={"*"}
          element={<Navigate to="/virtual-list" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
