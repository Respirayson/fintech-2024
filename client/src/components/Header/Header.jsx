import React, { useRef, useState, useEffect, useContext } from "react";
import "./header.css";
import { Container } from "reactstrap";
import { WebContext } from "../../context/WebContext";
import { NavLink, Link } from "react-router-dom";
import { checkWalletConnected } from "../../utils/connect";

const NAV__LINKS__GENERAL = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Contact",
    url: "/contact",
  },
  {
    display: "My Policies",
    url: "/user-policy"
  }
];

const NAV__LINKS__AGENT = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  {
    display: "Contact",
    url: "/contact",
  },
  {
    display: "My Policies",
    url: "/agent-policy"
  }
];

const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Contact",
    url: "/contact",
  }
];

const Header = () => {
  const headerRef = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(""); // Connected wallet public address
  const [authenticated, setAuthenticated] = useState(false);

  const { ethBalance, checkAuthenticated, handleLogout, accountType } =
    useContext(WebContext);
  const menuRef = useRef(null);

  //   useEffect(() => {
  //     window.addEventListener("scroll", () => {
  //       if (
  //         document.body.scrollTop > 80 ||
  //         document.documentElement.scrollTop > 80
  //       ) {
  //         headerRef.current.classList.add("header__shrink");
  //       } else {
  //         headerRef.current.classList.remove("header__shrink");
  //       }
  //     });

  //     return () => {
  //       window.removeEventListener("scroll");
  //     };
  //   }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    checkAuthenticated().then((isAuthenticated) => {
      setAuthenticated(isAuthenticated);
    });
    console.log(`Authenticated Status : ${authenticated}`);
  }, [checkAuthenticated]);

  useEffect(() => {
    /**
     * Fetches the connected wallet account on component mount.
     */
    async function fetchData() {
      const account = await checkWalletConnected();
      setCurrentAccount(account);
    }
    fetchData();
    window?.ethereum?.on("accountsChanged", fetchData);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className=" d-flex gap-2 align-items-center ">
              <span>
                <i className="ri-fire-fill"></i>
              </span>
              W
            </h2>
          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {authenticated === false ? (
                NAV__LINKS.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.url}
                      className={(navClass) =>
                        navClass.isActive ? "active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))
              ) : accountType === "General" ? (
                NAV__LINKS__GENERAL.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.url}
                      className={(navClass) =>
                        navClass.isActive ? "active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))
              ) : (
                NAV__LINKS__AGENT.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.url}
                      className={(navClass) =>
                        navClass.isActive ? "active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))
              )
              }
              {authenticated && (
                <li className="nav__item">
                  <NavLink
                    to="#"
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {ethBalance}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-3 ">
            {authenticated ? (
              <div className="row">
                <div className="col">
                  <button className="btn d-flex gap-2 align-items-center">
                    <span>
                      <i className="ri-logout-box-line"></i>
                    </span>
                    <Link
                      to="/"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Sign Out
                    </Link>
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn d-flex gap-2 align-items-center">
                <span>
                  <i className="ri-wallet-line"></i>
                </span>
                <Link to="/wallet">Connect Wallet</Link>
              </button>
            )}
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
