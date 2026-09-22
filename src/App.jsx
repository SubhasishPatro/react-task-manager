import { Link, Outlet } from "react-router-dom"


function App() {

  

  return (
    <div>
      <header className="p-3 bg-light d-flex justify-content-between">
        <div>
          <span className="bi bi-pencil-square fs-1 fw-bold text-primary"> <Link to='/' className="text-decoration-none"> Task Flow </Link> </span>
        </div>
        <div>
          <span>Products</span>
          <span className="mx-4">Pricing</span>
          <span>Preview</span>
        </div>
        <div>
          <button className="btn btn-primary">Support</button>
          <Link to='/login' className="btn btn-warning mx-2">Login</Link>
        </div>
      </header>
      <div style={{height:'500px'}} className="p-4 d-flex justify-content-center">
        <Outlet/>
      </div>
      <footer className="bg-light text-center p-2">
        &copy; Copyright 2026 Task Flow
      </footer>
    </div>
  )
}

export default App
