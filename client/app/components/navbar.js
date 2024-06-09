"use client"
import { Arvo } from 'next/font/google';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Link from 'next/link';
import { useRouter } from "next/navigation";

import StoreProvider from "../StoreProvider";
import { logoutUserAction } from "@/lib/action/auth.action";
import { persistor } from '@/lib/store';

const arvo = Arvo({ subsets: ['latin'], weight: "700" });

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [toggler, setToggler] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleTogglerClick = () => {
    setToggler(!toggler);
  };

  const handleDropDownClick = () => {
    setDropdown(!dropdown);
  }

  const logoutHandler = async () => {
    const persistedData = sessionStorage.getItem('persist:auth');
    const parsedData = JSON.parse(persistedData);
    const token = parsedData.token ? parsedData.token : null;
    if (token) {
      dispatch(logoutUserAction(token));
      await persistor.purge();
      sessionStorage.removeItem('persist:auth');
      setToggler(false);
      setDropdown(false);
      router.push('/auth/login');
    }
  }
  return (
    <StoreProvider>
      {
        !isAuthenticated ?
          <Image
            src="/dummy-logo.png"
            alt='logo'
            className='img-fluid mx-auto d-block'
            width={250}
            height={125}
            priority
          /> :
          <div className="container-fluid container-lg container-md bg-success">
            <nav className="navbar navbar-expand-lg d-flex">
              <h4 className={`text-white mb-0 ${arvo.className}`}>LogoIpsum</h4>
              <button
                className="navbar-toggler border border-white"
                type="button"
                onClick={handleTogglerClick}
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo01"
                aria-controls="navbarTogglerDemo01"
                aria-expanded={toggler}
                aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-list text-white" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
              </button>
              <div className={`collapse navbar-collapse ${toggler ? 'show' : 'hidden'}`} id="navbarTogglerDemo01">
                <ul className='navbar-nav ms-auto'>
                  <li className='nav-item'>
                    <Link className="nav-link text-white" aria-current="page" href="/">Main</Link>
                  </li>
                  <li className='nav-item'>
                    <Link className="nav-link text-white" href="#">Transactions</Link>
                  </li>
                  <li className='nav-item'>
                    <Link className="nav-link text-white" href="#">Due</Link>
                  </li>
                  <li className="nav-item dropend">
                    <button 
                      className='nav-link dropdown-toggle text-white fw-bolder'
                      data-bs-toggle="dropdown"
                      onClick={handleDropDownClick}
                      aria-expanded={dropdown}
                    >
                      {user.username ? user.username : 'user'}
                    </button>
                    <ul className={`dropdown-menu ${dropdown ? 'show' : ''} navbar-dropdown-menu`}>
                      <li>
                        <Link className="dropdown-item navbar-dropdown-item" href="/auth/change-password">Change password</Link>
                      </li>
                      <li>
                        <a className="dropdown-item navbar-dropdown-item" href="#" role="button" onClick={logoutHandler}>Logout</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
      }
    </StoreProvider>
  )
}

export default Navbar; 