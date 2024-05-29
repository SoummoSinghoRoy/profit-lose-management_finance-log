"use client"
import { useSelector } from "react-redux";
import Link from 'next/link';
import StoreProvider from "../StoreProvider";

const Navbar = () => {
  const {isAuthenticated} = useSelector(state => state.auth)
  return (
    <StoreProvider>
      <div className="container-fluid container-lg container-md">
        <nav className="navbar navbar-expand-lg bg-success">
          <div className="container-fluid">
            <Link className="navbar-brand text-white" href="#">Navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              { 
                !isAuthenticated ?
                (<div className="navbar-nav">
                  <Link className="nav-link text-white" href="/auth/signup">Signup</Link>
                  <Link className="nav-link text-white" href="/auth/login">Login</Link>
                </div> ) : 
                (<div className="navbar-nav">
                  <Link className="nav-link text-white" aria-current="page" href="#">Main</Link>
                  <Link className="nav-link text-white" href="#">Transactions</Link>
                  <Link className="nav-link text-white" href="#">Due</Link>
                  <a className="btn btn-link text-white" role="button" aria-disabled="true">Logout</a>
                </div>)
              }
            </div>
          </div>
        </nav>
      </div>
    </StoreProvider>
  )
}

export default Navbar; 