import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from './alert';
import { logoutRequest } from '@/utility/fetcher';

const Navbar = (props: any) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(0);
  const router = useRouter();

  const handleLogout = async (event: any) => {
    try {
      const response = await logoutRequest();
      if(response.status !== 200) {
        setAlertMessage(response.message);
        setAlertStatus(response.status);
      } else {
        console.log(response);
        setAuthenticated(false);
        props.setUser({});
        router.push('/auth/login');
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('Internal server error');
      setAlertStatus(500)
    }
  }

  return (
    <>
      <div className="container-fluid container-lg container-md">
        <nav className="navbar navbar-expand-lg bg-success">
          <div className="container-fluid">
            <Link className="navbar-brand text-white" href="#">Navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              { 
                !props.userData?.authenticated ?
                (<div className="navbar-nav">
                  <Link className="nav-link text-white" href="/auth/signup">Signup</Link>
                  <Link className="nav-link text-white" href="/auth/login">Login</Link>
                </div> ) : 
                (<div className="navbar-nav">
                  <Link className="nav-link text-white" aria-current="page" href="#">Main</Link>
                  <Link className="nav-link text-white" href="#">Transactions</Link>
                  <Link className="nav-link text-white" href="#">Due</Link>
                  <a className="btn btn-link text-white" role="button" aria-disabled="true" onClick={handleLogout}>Logout</a>
                </div>)
              }
            </div>
          </div>
        </nav>
      </div>
      {
        <>
          { alertMessage ? <Alert status= {alertStatus} message= {alertMessage}/> : null }
        </>
      }
    </>
  )
}

export default Navbar;