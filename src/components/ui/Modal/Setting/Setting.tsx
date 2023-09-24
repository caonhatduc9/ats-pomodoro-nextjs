import { FC, useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import ReactAudioPlayer from "react-audio-player";
import { Button } from "antd";
import Select from "react-select";
import { isInteger } from "lodash";
import classNames from "classnames/bind";

import styles from "./Setting.module.scss";
import useStore from "@/hooks/useStore";
import { actions } from "@/store";
import Number from "../../Number";
import Color from "../../Color";
import images from "@/assets/images";
import { SofiaProRegular } from "@/utils/fonts";
import axios from "axios";
import { checkImageBrightness } from "@/utils/checkImageBrightness";
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import 'sweetalert2/dist/sweetalert2.css'
import withReactContent from 'sweetalert2-react-content';
import { setShowPremiumPlan, setTimeRunning } from "@/store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "use-local-storage";
export interface AlarmProps {
  id?: number;
  label?: string;
  value?: any;
  source?: string;
}
export interface SettingProps {
  handleCloseReport?: any;
  onAutoStartBreaks?: any;
}

const cx = classNames.bind(styles);

const Setting: FC<SettingProps> = ({ ...props }) => {
  const { handleCloseReport, onAutoStartBreaks } = props;
  const [state, dispatch] = useStore();
  const {
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    bgNone,
    user,
    isAutoStartPomo,
    isAutoStartBreaks,
    isAutoSwitchTasks,
    alarms,
    tickings,
    currentAlarmSound,
    currentTickingSound,
    backgroundImages,
    currentBackgroundImage,
    isDarkMode,
    customColorHexPomo,
    customColorHexShort,
    customColorHexLong,
    isCloseSetting,
    isTimeRunning,
    currentTheme,
    playBgSound,
    defaultColorPomo,
    defaultColorShort,
    defaultColorLong,
    defaultPomodoro,
    defaultShortBreak,
    defaultLongBreak,
    defaultIsAutoBreak,
    defaultStartPomo,
    defaultLongBreakInterval,
    defaultIsDarkMode,
    defaultSoundAndBackground
  } = state;
  const MySwal = withReactContent(Swal)
  const [assetId, setAssetId] = useLocalStorage<number>("assetId", -9999999);
  const [settingLocal, setSettingLocal] = useLocalStorage<any>("settingLocal", {});

  const [alarmSound, setAlarmSound] = useState<AlarmProps>(
    currentAlarmSound.sound || alarms[0]
  );
  const [alarmVolume, setAlarmVolume] = useState(
    currentAlarmSound.volume || 50
  );
  const [alarmRepeat, setAlarmRepeat] = useState(currentAlarmSound.repeat || 1);
  const [tickingSound, setTickingSound] = useState<AlarmProps>(
    currentTickingSound.sound || tickings[0]
  );
  const [tickingVolume, setTickingVolume] = useState(
    currentTickingSound.volume || 50
  );

  const [pomodoroTimer, setPomodoroTimer] = useState(pomodoro);
  const [shortBreakTimer, setShortBreakTimer] = useState(shortBreak);
  const [longBreakTimer, setLongBreakTimer] = useState(longBreak);
  const [longBreakIntervalTimer, setlongBreakIntervalTimer] =
    useState(longBreakInterval);
  const [isAutoStartPomoTimer, setIsAutoStartPomoTimer] =
    useState<boolean>(isAutoStartPomo);
  const [isAutoStartShortTimer, setIsAutoStartShortTimer] =
    useState<boolean>(isAutoStartBreaks);
  const [isDark, setIsDark] = useState(isDarkMode);
  const [showSound, setShowSound] = useState(false);
  const [changeVolumeTicking, setChangeVolumeTicking] = useState(false);
  const [changeVolumeAlarm, setChangeVolumeAlarm] = useState(false);
  const [playBGSound, setPlayBGSound] = useState(playBgSound)
  const numImageActive = useRef(-1);

  useEffect(() => {
    backgroundImages.find((item: any, index: number) => {
      if (item.id === currentBackgroundImage.id) {
        numImageActive.current = index;
      }
      return item.id === currentBackgroundImage.id;
    });
  }, []);
  useEffect(() => {
    if (isCloseSetting) {
      const settings = {
        pomodoroTime: +pomodoroTimer,
        shortBreakTime: +shortBreakTimer,
        longBreakTime: +longBreakTimer,
        autoStartBreak: isAutoStartBreaks,
        autoStartPomodoro: isAutoStartPomo,
        longBreakInterval: +longBreakIntervalTimer,
        autoSwitchTask: isAutoSwitchTasks,
        ringSoundId: alarmSound?.id,
        ringSoundVolumn: alarmVolume,
        ringSoundRepeat: alarmRepeat,
        backgroundMusicId: tickingSound?.id,
        backgroundMusicVolumn: tickingVolume,
        currentBackgroundId: currentBackgroundImage?.id,
        darkmodeWhenRunning: isDark,
        pomodoroColor: customColorHexPomo,
        shortBreakColor: customColorHexShort,
        longBreakColor: customColorHexLong,
      };
      if (user?.access_token) {
        axios
          .post("/apiDetail/createSettingByUserId", settings, {
            headers: {
              authorization: `Bearer ${user?.access_token}`,
            },
          })
          .then((res) => {
          })
          .catch((err) => {
            console.log("error in request", err);
          });
      } else setSettingLocal(settings)
    }
  }, [isCloseSetting]);

  useEffect(() => {
    setShowSound(true);
    setAlarmVolume(alarmVolume);
  }, [alarmSound?.value, alarmVolume]);

  useEffect(() => {
    setShowSound(true);
    setTickingVolume(tickingVolume);
  }, [tickingSound?.value, tickingVolume]);

  useEffect(() => {
    const alarm = {
      sound: alarmSound,
      volume: alarmVolume,
      repeat: alarmRepeat,
    };
    dispatch(actions.setCurrentAlarmSound(alarm));
  }, [alarmSound, alarmVolume, alarmRepeat, dispatch]);

  useEffect(() => {
    const ticking = {
      sound: tickingSound,
      volume: tickingVolume,
    };
    dispatch(actions.setCurrentTickingSound(ticking));
  }, [tickingSound, tickingVolume, dispatch]);

  const handleChangePomo = (e: any) => {
    let num: number = e.target.value;
    if (!isNaN(num)) {
      if (isTimeRunning && currentTheme === "pomo") {
        MySwal.fire({
          icon: "warning",
          title: 'Are you sure?',
          text: "Time is still running, do you want to change and reset the time?",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          customClass: {
            // container: "login-success"
            popup: "wrapper-popup ",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setPomodoroTimer(num);
            dispatch(actions.setTimePomo(num));
            dispatch(setTimeRunning(false))
            dispatch(actions.setCurrentCustomColor(customColorHexPomo));
          }
        })
      } else {
        setPomodoroTimer(num);
        dispatch(actions.setTimePomo(num));
      }
    }
  };

  const handleChangeShort = (e: any) => {
    let num: number = e.target.value;
    if (!isNaN(num)) {
      if (isTimeRunning && currentTheme === "short") {
        MySwal.fire({
          icon: "warning",
          title: 'Are you sure?',
          text: "Time is still running, do you want to change and reset the time?",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          customClass: {
            // container: "login-success"
            popup: "wrapper-popup ",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setShortBreakTimer(num);
            dispatch(actions.setTimeShort(num));
            dispatch(setTimeRunning(false))
          }
        })
      } else {
        setShortBreakTimer(num);
        dispatch(actions.setTimeShort(num));
      }
    }
  };

  const handleChangeLong = (e: any) => {
    let num: number = e.target.value;
    if (!isNaN(num)) {
      if (isTimeRunning && currentTheme === "long") {
        MySwal.fire({
          icon: "warning",
          title: 'Are you sure?',
          text: "Time is still running, do you want to change and reset the time?",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
          customClass: {
            // container: "login-success"
            popup: "wrapper-popup ",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setLongBreakTimer(num);
            dispatch(actions.setTimeLong(num));
            dispatch(setTimeRunning(false))
          }
        })
      } else {
        setLongBreakTimer(num);
        dispatch(actions.setTimeLong(num));
      }
    }
  };

  const handleChangeLongBreakInterval = (e: any) => {
    let num: number = e.target.value;
    if (!isNaN(num)) {
      setlongBreakIntervalTimer(Math.floor(num));
      dispatch(actions.setLongBreakInterval(Math.floor(+num)));
    }
  };

  const handleChangeAutoStartBreaks = (nextChecked: boolean) => {
    setIsAutoStartShortTimer(nextChecked);
    dispatch(actions.setIsAutoStartBreaks(nextChecked));
  };

  const handleChangePlayBGSound = (nextChecked: boolean) => {
    setPlayBGSound(nextChecked)
    dispatch(actions.setPlayBgSound(nextChecked));
  }

  const handleChangeAutoStartPomo = (nextChecked: boolean) => {
    setIsAutoStartPomoTimer(nextChecked);
    dispatch(actions.setIsAutoStartPomo(nextChecked));
  };

  const handleChangeRepeatAlarm = (e: any) => {
    const num = e.target.value;
    if (+num >= 1) {
      setAlarmRepeat(Math.floor(e.target.value));
    }
  };

  const handleUpEst = () => {
    if (alarmRepeat >= 1) {
      let num: number;
      if (typeof alarmRepeat === "string") {
        num = parseInt(alarmRepeat, 10) + 1;
        setAlarmRepeat(num);
      } else {
        setAlarmRepeat(alarmRepeat + 1);
      }
    }
  };

  const handleDownEst = () => {
    if (alarmRepeat > 1) {
      setAlarmRepeat(alarmRepeat - 1);
    }
  };

  const handleChangeVolumeAlarm = (e: any) => {
    setAlarmVolume(e.target.value);
    setChangeVolumeAlarm(true);
    setChangeVolumeTicking(false);
  };

  const handleChangeVolumeTicking = (e: any) => {
    setChangeVolumeTicking(true);
    setChangeVolumeAlarm(false);
    setTickingVolume(e.target.value);
  };

  const handleEndedAlarm = () => {
    setShowSound(false);
  };

  const handlePlayTicking = () => {
    setTimeout(() => {
      setShowSound(false);
    }, 3000);
  };

  const handleKeyDownInputPomo = (e: any) => {
    const value = e.which || e.keycode;
    if (value === 38) {
      setPomodoroTimer(Math.floor(+pomodoroTimer + 1));
      dispatch(actions.setTimePomo(Math.floor(+pomodoroTimer + 1)));
    }
    if (value === 40) {
      if (!isInteger(pomodoroTimer) || pomodoroTimer === 0) {
        if (pomodoroTimer > 0 && pomodoroTimer < 1) {
          setPomodoroTimer(0);
          dispatch(actions.setTimePomo(0));
        } else {
          setPomodoroTimer(Math.floor(pomodoroTimer));
          dispatch(actions.setTimePomo(Math.floor(pomodoroTimer)));
        }
      } else {
        setPomodoroTimer(+pomodoroTimer - 1);
        dispatch(actions.setTimePomo(+pomodoroTimer - 1));
      }
    }
  };
  const handleKeyDownInputShort = (e: any) => {
    const value = e.which || e.keycode;
    if (value === 38) {
      setShortBreakTimer(Math.floor(+shortBreakTimer + 1));
      dispatch(actions.setTimeShort(Math.floor(+shortBreakTimer + 1)));
    }
    if (value === 40) {
      if (!isInteger(shortBreakTimer) || shortBreakTimer === 0) {
        if (shortBreakTimer > 0 && shortBreakTimer < 1) {
          setShortBreakTimer(0);
          dispatch(actions.setTimeShort(0));
        } else {
          setShortBreakTimer(Math.floor(shortBreakTimer));
          dispatch(actions.setTimeShort(Math.floor(shortBreakTimer)));
        }
      } else {
        setShortBreakTimer(+shortBreakTimer - 1);
        dispatch(actions.setTimeShort(+shortBreakTimer - 1));
      }
    }
  };
  const handleKeyDownInputLong = (e: any) => {
    const value = e.which || e.keycode;
    if (value === 38) {
      setLongBreakTimer(Math.floor(+longBreakTimer + 1));
      dispatch(actions.setTimeLong(Math.floor(+longBreakTimer + 1)));
    }
    if (value === 40) {
      if (!isInteger(longBreakTimer) || longBreakTimer === 0) {
        if (longBreakTimer > 0 && longBreakTimer < 1) {
          setLongBreakTimer(0);
          dispatch(actions.setTimeLong(0));
        } else {
          setLongBreakTimer(Math.floor(longBreakTimer));
          dispatch(actions.setTimeLong(Math.floor(longBreakTimer)));
        }
      } else {
        setLongBreakTimer(+longBreakTimer - 1);
        dispatch(actions.setTimeLong(+longBreakTimer - 1));
      }
    }
  };
  const handleKeyDownLongInterval = (e: any) => {
    const value = e.which || e.keycode;
    if (value === 38) {
      setlongBreakIntervalTimer(Math.floor(+longBreakIntervalTimer + 1));
      dispatch(
        actions.setLongBreakInterval(Math.floor(+longBreakIntervalTimer + 1))
      );
    }
    if (value === 40) {
      if (longBreakIntervalTimer === 0) {
        setlongBreakIntervalTimer(0);
        dispatch(actions.setLongBreakInterval(0));
      } else {
        setlongBreakIntervalTimer(+longBreakIntervalTimer - 1);
        dispatch(actions.setLongBreakInterval(+longBreakIntervalTimer - 1));
      }
    }
  };
  const handleChangeDarkMode = (nextChecked: boolean) => {
    setIsDark(nextChecked);
    dispatch(actions.setIsDarkMode(nextChecked));
  };

  const handleClickItemDisable = (option: any) => {
    setAssetId(option.id)
    dispatch(setShowPremiumPlan(true))
  }

  const setSettingDefault = () => {
    dispatch(actions.setTimePomo(defaultPomodoro))
    setPomodoroTimer(defaultPomodoro)
    dispatch(actions.setTimeShort(defaultShortBreak))
    setShortBreakTimer(defaultShortBreak)
    dispatch(actions.setTimeLong(defaultLongBreak))
    setLongBreakTimer(defaultLongBreak)
    dispatch(actions.setIsAutoStartBreaks(defaultIsAutoBreak))
    setIsAutoStartShortTimer(defaultIsAutoBreak)
    dispatch(actions.setIsAutoStartPomo(defaultStartPomo))
    setIsAutoStartPomoTimer(defaultStartPomo)
    dispatch(actions.setLongBreakInterval(defaultLongBreakInterval))
    setlongBreakIntervalTimer(defaultLongBreakInterval)
    dispatch(actions.setIsDarkMode(defaultIsDarkMode))
    setIsDark(defaultIsDarkMode)
    dispatch(actions.setCustomColorHexPomo(defaultColorPomo))
    dispatch(actions.setCustomColorHexShort(defaultColorShort))
    dispatch(actions.setCustomColorHexLong(defaultColorLong))
    if (currentTheme === "pomo") {
      dispatch(actions.setCurrentCustomColor(defaultColorPomo))
    } else if (currentTheme === "short") {
      dispatch(actions.setCurrentCustomColor(defaultColorShort))
    } else if (currentTheme === "long") {
      dispatch(actions.setCurrentCustomColor(defaultColorLong))
    }
    dispatch(actions.setCurrentAlarmSound(defaultSoundAndBackground.alarm))
    setAlarmSound(defaultSoundAndBackground.alarm.sound)
    setAlarmVolume(defaultSoundAndBackground.alarm.volume)
    setAlarmRepeat(defaultSoundAndBackground.alarm.repeat)
    dispatch(actions.setCurrentTickingSound(defaultSoundAndBackground.ticking))
    setTickingSound(defaultSoundAndBackground.ticking.sound)
    setTickingVolume(defaultSoundAndBackground.ticking.volume)
    dispatch(actions.setCustomBackgroundWallPaper(''))
    dispatch(actions.setCurrentBackgroundImage(bgNone))
    numImageActive.current = 5
  }

  const handleClickResetSetting = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Reset all settings? You can't undo this action.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reset',
      customClass: {
        popup: "modal-content pop-up-swal",
        title: "login-sc-title",
        htmlContainer: "login-des-text"
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const settings = {
          pomodoroTime: +defaultPomodoro,
          shortBreakTime: +defaultShortBreak,
          longBreakTime: +defaultLongBreak,
          autoStartBreak: defaultIsAutoBreak,
          autoStartPomodoro: defaultStartPomo,
          longBreakInterval: +defaultLongBreakInterval,
          autoSwitchTask: isAutoSwitchTasks,
          ringSoundId: defaultSoundAndBackground?.alarm?.sound?.id,
          ringSoundVolumn: defaultSoundAndBackground?.alarm.volume,
          ringSoundRepeat: defaultSoundAndBackground?.alarm.repeat,
          backgroundMusicId: defaultSoundAndBackground?.ticking?.sound?.id,
          backgroundMusicVolumn: defaultSoundAndBackground?.ticking.volume,
          currentBackgroundId: defaultSoundAndBackground?.backgroundImage?.id,
          darkmodeWhenRunning: defaultIsDarkMode,
          pomodoroColor: defaultColorPomo,
          shortBreakColor: defaultColorShort,
          longBreakColor: defaultColorLong,
        };
        if (user?.access_token) {
          axios
            .post("/apiDetail/createSettingByUserId", settings, {
              headers: {
                authorization: `Bearer ${user?.access_token}`,
              },
            })
            .then((res) => {
              setSettingDefault()
            })
            .catch((err) => {
              console.log("error in request", err);
            });
        } else {
          setSettingDefault()
        }
      }
    })
  }

  return (
    <div className={cx("modal-report", { [SofiaProRegular.className]: true })}>
      {showSound && changeVolumeTicking && !playBGSound && (
        <ReactAudioPlayer
          src={tickingSound?.source}
          autoPlay
          volume={tickingVolume / 100}
          onEnded={handleEndedAlarm}
          onPlay={handlePlayTicking}
        />
      )}
      {showSound && changeVolumeAlarm && !playBGSound && (
        <ReactAudioPlayer
          src={alarmSound?.source}
          autoPlay
          volume={alarmVolume / 100}
          onEnded={handleEndedAlarm}
        />
      )}

      <div className="modal-heading">
        <span>SETTING</span>
        <Button
          size="middle"
          className={cx("btn-close-custom")}
          onClick={handleCloseReport}
        >
          <div>x</div>
        </Button>
      </div>
      <div className={cx("timer")}>
        <div className="set-timer">
          <div className="set">
            <span>Time (minutes)</span>
            <div className="set-time">
              <div className="set-pomo">
                <label className="pomo">Pomodoro</label>
                <input
                  type="text"
                  className="pomo-input"
                  value={pomodoroTimer}
                  onChange={handleChangePomo}
                  onKeyDown={handleKeyDownInputPomo}
                />
              </div>
              <div className="set-pomo">
                <label className="pomo">Short Break</label>
                <input
                  type="text"
                  className="pomo-input"
                  value={shortBreakTimer}
                  onChange={handleChangeShort}
                  onKeyDown={handleKeyDownInputShort}
                />
              </div>
              <div className="set-pomo">
                <label className="pomo">Long Break</label>
                <input
                  type="text"
                  className="pomo-input"
                  value={longBreakTimer}
                  onChange={handleChangeLong}
                  onKeyDown={handleKeyDownInputLong}
                />
              </div>
            </div>
          </div>
          <div className="auto-start-break set">
            <span>Auto start Breaks?</span>
            <Switch
              onChange={handleChangeAutoStartBreaks}
              checked={isAutoStartShortTimer || false}
              className={styles.reactSwitch}
              onColor="#2496ff"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>
          <div className="auto-start-break set">
            <span>Auto start Pomodoros?</span>
            <Switch
              onChange={handleChangeAutoStartPomo}
              checked={isAutoStartPomoTimer || false}
              className={styles.reactSwitch}
              onColor="#2496ff"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>
          {/* version 2 */}
          {/* <div className="auto-start-break set">
                        <span>Auto switch tasks</span>
                        <Switch
                            onChange={handleChangeAutoSwitchTasks}
                            checked={isAutoSwitchTasksTimer || false}
                            className={styles.reactSwitch}
                            onColor="#2496ff"
                            uncheckedIcon={false}
                            checkedIcon={false}
                        />
                    </div> */}
          <div className="auto-start-break set">
            <span>Long Break Interval</span>
            <input
              type="text"
              width="70"
              className="long-break"
              value={longBreakIntervalTimer}
              onChange={handleChangeLongBreakInterval}
              onKeyDown={handleKeyDownLongInterval}
            />
          </div>

          <div className="set alarm-sound">
            <div className="auto-start-break">
              <span>Alarm Sound</span>
              <div className="choose-alarm">
                <Select
                  value={alarmSound}
                  defaultValue={currentAlarmSound.sound || alarms[0]}
                  onChange={(option: any) => {
                    if (!option.isFree) {
                      handleClickItemDisable(option)
                    }
                    else {
                      setAlarmSound(option);
                      setChangeVolumeAlarm(true);
                      setChangeVolumeTicking(false);
                    }
                  }}
                  getOptionLabel={(alarm: any) => alarm.label}
                  getOptionValue={(alarm: any) => alarm.label}
                  options={alarms}
                  isClearable={true}
                  backspaceRemovesValue={true}
                  components={{
                    Option: ({ innerProps, label, ...rest }) => (
                      <div {...innerProps} className={!rest.data.isFree ? "custom-select-field disable" : rest.isSelected ? "custom-select-field selected" : "custom-select-field"}>                        <span style={{ marginRight: '8px' }}>{label}</span>
                        {
                          !rest.data.isFree &&
                          <FontAwesomeIcon icon={faLock} className="project-icon" />
                        }
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
            <div className="alarm-range">
              <div className="alarm-wrapper">
                <span>{alarmVolume}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="alarm-input-range"
                  id="myRange"
                  value={alarmVolume}
                  onChange={handleChangeVolumeAlarm}
                />
              </div>
            </div>
            <div className="alarm-repeat">
              Repeat
              <Number
                isHorizontal={true}
                value={alarmRepeat}
                onChangeInput={handleChangeRepeatAlarm}
                onChangeButtonUp={handleUpEst}
                onChangeButtonDown={handleDownEst}
              />
            </div>
          </div>
          <div className="set alarm-sound">
            <div className="auto-start-break">
              <span>Background Sound</span>
              <div className="choose-alarm">
                <Select
                  value={tickingSound}
                  onChange={(option: any) => {
                    if (!option.isFree) {
                      handleClickItemDisable(option)
                    }
                    else {
                      setTickingSound(option);
                      setChangeVolumeTicking(true);
                      setChangeVolumeAlarm(false);
                    }
                  }}
                  getOptionLabel={(ticking: any) => ticking.label}
                  getOptionValue={(ticking: any) => ticking.label}
                  options={tickings}
                  isClearable={true}
                  backspaceRemovesValue={true}
                  defaultValue={currentTickingSound.sound || tickings[0]}
                  components={{
                    Option: ({ innerProps, label, ...rest }) => (
                      <div {...innerProps} className={!rest.data.isFree ? "custom-select-field disable" : rest.isSelected ? "custom-select-field selected" : "custom-select-field"}>
                        <span style={{ marginRight: '8px' }}>{label}</span>
                        {
                          !rest.data.isFree &&
                          <FontAwesomeIcon icon={faLock} className="project-icon" />
                        }
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
            <div className="alarm-range">
              <div className="alarm-wrapper">
                <span>{tickingVolume}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="alarm-input-range"
                  id="myRange"
                  value={tickingVolume}
                  onChange={handleChangeVolumeTicking}
                />
              </div>
            </div>
            <div className="alarm-switch">
              <span>Play background sound</span>
              <Switch
                onChange={handleChangePlayBGSound}
                checked={playBGSound || false}
                className={styles.reactSwitch}
                onColor="#2496ff"
                uncheckedIcon={false}
                checkedIcon={false}
                disabled={tickingSound?.label === "None" ? true : false}
              />
            </div>
          </div>
          <div className="set alarm-sound">
            <div className="auto-start-break">
              <span>Color Themes</span>
              <div className={cx("color-themes-wrapper")}>
                <div className={cx("color-theme-item")}>
                  <span>Pomodoro</span>
                  <div>
                    <Color theme="pomo" />
                  </div>
                </div>
                <div className={cx("color-theme-item")}>
                  <span>Short Break</span>
                  <div>
                    <Color theme="short" />
                  </div>
                </div>
                <div className={cx("color-theme-item")}>
                  <span>Long Break</span>
                  <div>
                    <Color theme="long" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="set auto-start-break images">
            <span>Background image</span>
            <div className={cx("images-wrapper")}>
              {backgroundImages &&
                backgroundImages.length > 0 &&
                backgroundImages.map((item: any, index: number) => {
                  return (
                    <div
                      className={cx("image", {
                        ["active"]: index === numImageActive.current,
                        ['lock']: !item.isFree
                      })}
                      key={index}
                      style={{
                        backgroundImage: `url(${item?.value?.src})`,
                      }}
                      onClick={() => {
                        if (item.isFree) {
                          numImageActive.current = index;
                          if (index === 5) {
                            dispatch(actions.setCustomBackgroundWallPaper(""));
                            dispatch(actions.setCurrentBackgroundImage(bgNone));
                          } else {
                            dispatch(
                              actions.setCustomBackgroundWallPaper(
                                item?.value?.src
                              )
                            );
                            dispatch(actions.setCurrentBackgroundImage(item));
                          }
                          if (item?.name !== "None" && item?.name !== undefined) {
                            checkImageBrightness(item?.value?.src)
                              .then((result) => {
                                if (result.type === "light") {
                                  dispatch(
                                    actions.setPomoBackground("rgba(0,0,0,0.22)")
                                  );
                                } else {
                                  dispatch(
                                    actions.setPomoBackground(
                                      "rgba(255, 255, 255, 0.15"
                                    )
                                  );
                                }
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                              });
                          } else {
                            dispatch(
                              actions.setPomoBackground("rgba(0,0,0,0.1)")
                            );
                          }
                        }
                        else {
                          setAssetId(item.id)
                          dispatch(setShowPremiumPlan(true))
                        }
                      }}
                    >
                      {!item.isFree ? <FontAwesomeIcon icon={faLock} className="project-icon" /> : <></>}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="set auto-start-break">
            <span>Dark Mode when running</span>
            <Switch
              onChange={handleChangeDarkMode}
              checked={isDark || false}
              className={styles.reactSwitch}
              onColor="#2496ff"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>
          <div className="set auto-start-break">
            <span>Reset settings</span>
            <Button size="large" onClick={handleClickResetSetting}>Reset</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
