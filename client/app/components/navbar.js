"use client"
import { useSelector, useDispatch } from "react-redux";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import StoreProvider from "../StoreProvider";
import { logoutUserAction } from "@/lib/action/auth.action";
import { persistor } from "@/lib/store";

const Navbar = () => {
  const {isAuthenticated} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () => {
    const persistedData = sessionStorage.getItem('persist:auth');
    const parsedData = JSON.parse(persistedData);
    const token = parsedData.token ? parsedData.token : null;
    if (token) {
      dispatch(logoutUserAction(token));
      await persistor.purge();
      sessionStorage.removeItem('persist:auth');
      router.push('/auth/login');
    }
  }
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
                  <button type="button" className="btn btn-link text-white" onClick={logoutHandler}>Logout</button>
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