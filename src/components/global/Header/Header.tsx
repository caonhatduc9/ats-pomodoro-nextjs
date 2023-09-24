import {
  faBell,
  faLock,
  faRightFromBracket,
  faRocket,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { FC, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { actions } from "@/store";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button } from "antd";
import { signOut } from "next-auth/react";

import images from "@/assets/images";
import useStore from "@/hooks/useStore";
import styles from "./Header.module.scss";
import { SofiaProLight, SofiaProRegular } from "@/utils/fonts";

import Menu from "@/components/ui/Popper/Menu";
import {
  Info,
  Login,
  Profile,
  Projects,
  Report,
  ResetPassword,
  Setting,
  SignUp,
} from "@/components/ui";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const cx = classNames.bind(styles);

interface HeaderProps { }

const userMenu = [
  { icon: <FontAwesomeIcon icon={faUser} />, title: "Profile", small: true },
  // { icon: <FontAwesomeIcon icon={faRocket} />, title: 'Manage Projects', small: true },
  // { icon: <FontAwesomeIcon icon={faTrashCan} />, title: 'Delete Account', small: true },
  {
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    title: "Log out",
    separate: true,
    small: true,
  },
];

const Header: FC<HeaderProps> = ({ ...props }) => {
  const router = useRouter();
  const [state, dispatch] = useStore();
  const {
    currentTheme,
    customBackgroundWallpaper,
    currentCustomColor,
    user,
    showLoginReducer,
    showResetPassReducer,
    showSignUpReducer,
    showProfileReducer,
    showProjectsReducer,
    showPremiumPlanReducer,
    isShowAlarmReducer
  } = state;
  const [showReport, setShowReport] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showBellOn, setShowBellOn] = useState(false)

  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleShowProfile = () => {
    setShowProfile(true);
  };
  const handleShowProjects = () => {
    setShowProjects(true);
  };
  const handleShowSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };
  const handleShowResetPass = () => {
    setShowLogin(false);
    setShowResetPass(true);
  };
  const handleCloseLogin = () => {
    setShowLogin(false);
    dispatch(actions.setShowLogin(false));
  };
  const handleCloseSignUp = () => {
    setShowSignUp(false);
    dispatch(actions.setShowSignUp(false));
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
    dispatch(actions.setShowProfile(false));
    dispatch(actions.setOpenMenuTippy(true))
  };
  const handleCloseProjects = () => {
    setShowProjects(false);
    dispatch(actions.setShowProjects(false));
  };
  const handleCloseResetPass = () => {
    setShowResetPass(false);
    dispatch(actions.setShowResetPass(false));
    dispatch(actions.setShowLogin(false));
    setShowLogin(false);
  };
  const handleBackLoginFromResetPass = () => {
    setShowResetPass(false);
    dispatch(actions.setShowResetPass(false));
    dispatch(actions.setShowLogin(true));
    setShowLogin(true);
  };
  const handleBackLoginFromSignUp = () => {
    setShowSignUp(false);
    dispatch(actions.setShowSignUp(false));
    dispatch(actions.setShowLogin(true));
    setShowLogin(true);
  };
  const handleCloseInfo = () => setShowInfo(false);
  const handleCloseReport = () => setShowReport(false);
  const handleCloseSetting = () => {
    dispatch(actions.setIsCloseSetting(true));
    setShowSetting(false);
  };

  const handleShowInfo = () => {
    setShowInfo(true);
  };

  const handleShowReport = () => {
    setShowReport(true);
  };
  const handleShowSetting = () => {
    setShowSetting(true);
    dispatch(actions.setIsCloseSetting(false));
  };

  useEffect(() => {
    if (!user) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isShowAlarmReducer) {
      setShowBellOn(true)
    }
    else setShowBellOn(false)
  }, [isShowAlarmReducer])

  const colorBackground = !customBackgroundWallpaper ? currentCustomColor : "";

  const handleClickBellOn = () => {
    dispatch(actions.setShowAlarmReducer(false))
  }

  return (
    <header>
      <div className={cx("inner")}>
        <div className={cx("header")}>
          <h1 className={cx("logo")}>
            <div onClick={handleShowInfo} style={{ cursor: "pointer" }}>
              <Image
                className={cx("logo-icon")}
                src={images.PomodoroWhite}
                width={150}
                height={30}
                alt="logo-pomodoro"
              />
            </div>
          </h1>
          <div style={{ marginLeft: "80px" }}>
            <Image
              className={cx("logo-icon")}
              src={images.ATSlogo}
              width={90}
              height={48}
              alt="logo-pomodoro"
            />
          </div>
          <span className={cx("actions")}>
            <OverlayTrigger
              placement={"bottom"}
              show={!showBellOn ? false : true}
              overlay={
                <Tooltip className={cx("custom-tooltip")}>
                  {
                    showBellOn && "Click to turn off the bell"
                  }
                </Tooltip>
              }
            >
              <div className={cx("bell-wrapper", { ['active']: showBellOn })} onClick={handleClickBellOn}>
                {
                  showBellOn ?
                    <div className={cx("bell")}>
                      <div className={cx("bell-border")}></div>
                      <FontAwesomeIcon icon={faBell} className={cx("fas", { ["btn-bell"]: true })} />
                    </div> :
                    <FontAwesomeIcon icon={faBell} className={cx("btn-bell-without-animation")} />
                }
              </div>
            </OverlayTrigger>
            <Button
              className={cx("btn")}
              size="middle"
              onClick={handleShowReport}
            >
              <div className={SofiaProLight.className}>Report</div>
            </Button>

            <Button
              className={cx("btn")}
              size="middle"
              onClick={handleShowSetting}
            >
              <div className={SofiaProLight.className}>Setting</div>
            </Button>

            {/* modal */}
            <Modal
              show={showInfo}
              onHide={handleCloseInfo}
              className={cx(
                "info-wrapper animate__animated animate__fadeInUp animate__faster"
              )}
            >
              <Modal.Body>
                <Info handleCloseInfo={handleCloseInfo} />
              </Modal.Body>
            </Modal>

            <Modal
              show={showReport}
              onHide={handleCloseReport}
              className={cx("report-wrapper")}
            >
              <Modal.Body>
                <Report handleCloseReport={handleCloseReport} />
              </Modal.Body>
            </Modal>

            <Modal show={showSetting && !showPremiumPlanReducer} onHide={handleCloseSetting}>
              <Modal.Body>
                <Setting handleCloseReport={handleCloseSetting} />
              </Modal.Body>
              <div className="close-timer">
                <Button
                  size="middle"
                  className="btn-close1"
                  onClick={handleCloseSetting}
                >
                  OK
                </Button>
              </div>
            </Modal>
            <Modal
              show={
                (!showLoginReducer && showResetPassReducer) || showLoginReducer
                  ? showLoginReducer
                  : showLogin
              }
              onHide={handleCloseLogin}
              className="reset-pass-wrapper"
            >
              <Modal.Body>
                <Login
                  onCloseLogin={handleCloseLogin}
                  onShowLogin={handleShowLogin}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={
                !showLoginReducer && showResetPassReducer
                  ? showResetPassReducer
                  : showResetPass
              }
              onHide={handleCloseResetPass}
              className="reset-pass-wrapper"
            >
              <Modal.Body>
                <ResetPassword
                  onCloseResetPassword={handleBackLoginFromResetPass}
                  onShowResetPassword={handleShowResetPass}
                  onClose={() => setShowLogin(false)}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={
                !showLoginReducer && showSignUpReducer
                  ? showSignUpReducer
                  : showSignUp
              }
              onHide={handleCloseSignUp}
              className="reset-pass-wrapper"
            >
              <Modal.Body>
                <SignUp
                  onCloseSignUp={handleBackLoginFromSignUp}
                  onShowSignUp={handleShowSignUp}
                  onClose={() => {
                    setShowLogin(false)
                    setShowSignUp(false)
                  }}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={showProfileReducer || showProfile}
              onHide={handleCloseProfile}
              className="reset-pass-wrapper"
            >
              <Modal.Body>
                <Profile
                  onCloseProfile={handleCloseProfile}
                  onShowProfile={handleShowProfile}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={showProjectsReducer || showProjects}
              onHide={handleCloseProjects}
              className="reset-pass-wrapper"
            >
              <Modal.Body>
                <Projects
                  onCloseProjects={handleCloseProjects}
                  onShowProjects={handleShowProjects}
                />
              </Modal.Body>
            </Modal>

            {user?.userId ? (
              <>
                <Menu items={userMenu}>
                  <div className={cx("user")}>
                    <Image
                      src={images.userFallBack}
                      alt="user picture"
                      width={28}
                      height={28}
                    />
                  </div>
                </Menu>
              </>
            ) : (
              <Button
                className={cx("btn")}
                size="middle"
                onClick={handleShowLogin}
              >
                <div className={SofiaProLight.className}>Log In</div>
              </Button>
            )}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
