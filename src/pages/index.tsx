import { useRouter } from 'next/router'
import styles from "@/styles/Home.module.scss";
import { Blog, Menu, TaskItem, Pomodoro, DetailTask, AdBanner, AutoHideComponent, PremiumPlan } from "@/components/ui";

import { Layout } from "antd";
import useStore from "@/hooks/useStore";
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faRocket, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { actions } from "@/store";
const cx = classNames.bind(styles);
import { useCookies } from 'react-cookie';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import Image from 'next/image';
import images from '@/assets/images';
import { checkImageBrightness } from '@/utils/checkImageBrightness';
import ReactAudioPlayer from 'react-audio-player';
import useLocalStorage from 'use-local-storage';

export default function Home() {
  const actionMenu = [
    { icon: <FontAwesomeIcon icon={faRightFromBracket} />, title: 'Clear all tasks', separate: true, small: true },
  ];
  const [state, dispatch] = useStore();
  const { todos, currentTheme, pomodoro, user,
    shortBreak, longBreak, currentCustomColor,
    customBackgroundWallpaper, isDarkMode, isTimeRunning,
    isAddTodoSuccess, isAddProjectSuccess, projectList, isEditProjectSuccess, showPremiumPlanReducer, isShowAddTodo,
    playBgSound, currentTickingSound, alarms, tickings, backgroundImages, bgNone } = state;
  const [idShowDetailTask, setIdShowDetailTask] = useState<number>()
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const { data: session } = useSession()
  const [tickingSound, setTickingSound] = useState(currentTickingSound)
  const [todosLocal, setTodosLocal] = useLocalStorage("todosLocal", [])

  useEffect(() => {
    setTickingSound(currentTickingSound)
  }, [currentTickingSound])

  useEffect(() => {
    if (session) {
      const urlPost = session?.user?.image?.includes('avatars.githubusercontent.com') ? "/apiAuth/github" : "/apiAuth/google"
      axios
        .post(urlPost, {
          email: session?.user?.email,
          image: session?.user?.image,
        })
        .then(res => {
          const result = res.data.data
          if (user?.userId != result?.userId) {
            dispatch(actions.setUser(result))
            setCookie('user', JSON.stringify(result), {
              path: '/',
              httpOnly: false
            });
            cookies?.user && dispatch(actions.setShowLogin(false))
            // dispatch(actions.setUser(cookies.user))
          }
        })
        .catch(err => {
          console.log('error in request', err.response?.data?.message);
          !cookies?.user && dispatch(actions.setShowLogin(true))
        });
    }
  }, [session])

  useEffect(() => {
    cookies.user && dispatch(actions.setUser(cookies.user))
  }, [cookies.user])

  const handleShowPremiumPlan = () => {
    dispatch(actions.setShowPremiumPlan(true))
  }

  const handleClosePremiumPlan = () => {
    dispatch(actions.setShowPremiumPlan(false))
  }

  const getApiTasks = async (accessToken: string) => {
    if (accessToken) {
      axios.get(`/apiDetail/task`, {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => {
          const data = res.data?.data
          let newTodos = data.map((todo: any) => {
            return ({
              activePomo: todo?.status === "DOING" ? true : false,
              id: todo?.taskId,
              title: todo?.taskName,
              isDone: todo?.status === "DONE" ? true : false,
              numAct: todo?.actualPomodoro,
              estPomo: todo?.estimatePomodoro,
              note: todo?.note,
              project: todo?.project,
              status: todo?.status
            })
          })
          newTodos = newTodos.filter((todo: any) => {
            return (todo?.status !== "DELETE")
          })
          const currentTodo = data.find((todo: any) => {
            return todo.status === "DOING"
          })

          dispatch(actions.setCurrentTask({
            activePomo: currentTodo?.status === "DOING" ? true : false,
            id: currentTodo?.taskId,
            title: currentTodo?.taskName,
            isDone: currentTodo?.status === "DONE" ? true : false,
            numAct: currentTodo?.actualPomodoro,
            estPomo: currentTodo?.estimatePomodoro,
            note: currentTodo?.note,
            project: currentTodo?.project,
          }))
          dispatch(actions.setNewTodo(newTodos))
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const getApiProjects = async (accessToken: string) => {
    axios.get("/apiProject/getProjects", {
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    })
      .then(res => {
        const data = res.data?.data
        const newData = data && data.map((item: any) => {
          return {
            projectId: item?.projectId,
            projectName: item?.projectName
          }
        })
        dispatch(actions.setProjectList(newData))
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (user?.userId) {
      const accessToken = user?.access_token
      axios.get(`/apiDetail/getSettingByUserId`, {
        headers: {
          'authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => {
          const data = res.data?.data
          const alarmSoundApi = {
            sound: {
              id: data?.ringSound?.assetId,
              label: data?.ringSound?.assetName,
              value: data?.ringSound?.assetName,
              source: data?.ringSound?.assetUrl,
              isFree: data?.ringSound?.isFree
            },
            volume: data?.ringSoundVolumn,
            repeat: data?.ringSoundRepeat
          }
          const tickingSoundApi = {
            sound: {
              id: data?.backgroundMusic?.assetId,
              label: data?.backgroundMusic?.assetName,
              value: data?.backgroundMusic?.assetName,
              source: data?.backgroundMusic?.assetUrl,
              isFree: data?.backgroundMusic?.isFree
            },
            volume: data?.backgroundMusicVolumn,
          }
          const alarmsApi = data?.assets?.ringSounds.length > 0 && data?.assets?.ringSounds.map((item: any) => {
            return ({
              id: item?.assetId,
              label: item?.assetName,
              value: item?.assetName,
              source: item?.assetUrl,
              isFree: item?.isFree,
              type: "alarm"
            })
          })
          const alarmDefault = data?.assets?.ringSounds.length > 0 && data?.assets?.ringSounds.find((item: any) => item.assetName === "Alarm Clock")
          const tickingsApi = data?.assets?.backgroundMusics.length > 0 && data?.assets?.backgroundMusics.map((item: any) => {
            return ({
              id: item?.assetId,
              label: item?.assetName,
              value: item?.assetName,
              source: item?.assetUrl,
              isFree: item?.isFree,
              type: "ticking"
            })
          })
          const tickingDefault = data?.assets?.backgroundMusics.length > 0 && data?.assets?.backgroundMusics.find((item: any) => item.assetName === "None")
          let backgroundsApi = data?.assets?.backgroundImages.length > 0 && data?.assets?.backgroundImages.map((item: any) => {
            return (
              {
                id: item?.assetId,
                value: {
                  src: item?.assetUrl,
                },
                name: item?.assetName,
                isFree: item?.isFree
              }
            )
          })
          let bgNone: any
          backgroundsApi = backgroundsApi.filter((item: any) => {
            if (item.name === "None") {
              bgNone = item
            }
            return item.name !== "None"
          })
          backgroundsApi.push(bgNone)
          dispatch(actions.setBGNone(bgNone))
          dispatch(actions.setDefaultSoundBackground({
            alarm: {
              sound: {
                id: alarmDefault.assetId,
                label: alarmDefault.assetName,
                value: alarmDefault.assetName,
                source: alarmDefault.assetUrl,
                isFree: 1,
                type: "alarm"
              },
              volume: 50,
              repeat: 1,
            },
            ticking: {
              sound: {
                id: tickingDefault.assetId,
                label: tickingDefault.assetName,
                value: tickingDefault.assetName,
                source: tickingDefault.assetUrl,
                isFree: 1,
                type: "ticking"
              },
              volume: 50,
            },
            backgroundImage: bgNone
          }))
          const currentBG = {
            id: data?.currentBackground?.assetId,
            value: {
              src: data?.currentBackground?.assetUrl,
            },
            name: data?.currentBackground?.assetName
          }
          dispatch(actions.setTimePomo(data?.pomodoroTime))
          dispatch(actions.setTimeShort(data?.shortBreakTime))
          dispatch(actions.setTimeLong(data?.longBreakTime))
          dispatch(actions.setIsAutoStartBreaks(data?.autoStartBreak === 1 ? true : false))
          dispatch(actions.setIsAutoStartPomo(data?.autoStartPomodoro === 1 ? true : false))
          dispatch(actions.setLongBreakInterval(data?.longBreakInterval))
          dispatch(actions.setIsDarkMode(data?.darkmodeWhenRunning === 1 ? true : false))
          dispatch(actions.setCustomColorHexPomo(data?.pomodoroColor))
          dispatch(actions.setCustomColorHexShort(data?.shortBreakColor))
          dispatch(actions.setCustomColorHexLong(data?.longBreakColor))
          dispatch(actions.setCurrentCustomColor(data?.pomodoroColor))
          dispatch(actions.setCurrentAlarmSound(alarmSoundApi))
          dispatch(actions.setCurrentTickingSound(tickingSoundApi))
          setTickingSound(tickingSoundApi)
          dispatch(actions.setAlarms(alarmsApi))
          dispatch(actions.setTickings(tickingsApi))
          dispatch(actions.setBackgounds(backgroundsApi))
          dispatch(actions.setCustomBackgroundWallPaper(currentBG?.id === bgNone?.id ? '' : currentBG?.value?.src))
          dispatch(actions.setCurrentBackgroundImage(currentBG?.id === bgNone?.id ? bgNone : currentBG))
          if (currentBG?.id !== bgNone?.id) {
            checkImageBrightness(currentBG?.value?.src)
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
        })
        .catch(err => {
          if (err?.response?.data?.statusCode === 401) {
            removeCookie("user")
          }
        });
      getApiTasks(accessToken)
      getApiProjects(accessToken)
    } else {
      const dataSettingTemp = window.localStorage.getItem("settingLocal")
      let dataSetting: any
      if (dataSettingTemp) {
        dataSetting = JSON.parse(dataSettingTemp)
      }
      if (dataSetting) {
        const alarmSoundTemp = alarms.find((item: any) => item.id === dataSetting.ringSoundId)
        const alarmSound = {
          sound: alarmSoundTemp,
          volume: +dataSetting.ringSoundVolumn,
          repeat: dataSetting.ringSoundRepeat,
        }
        const tickingSoundTemp = tickings.find((item: any) => item.id === dataSetting.backgroundMusicId)
        const tickingSound = {
          sound: tickingSoundTemp,
          volume: +dataSetting.backgroundMusicVolumn,
        }
        const currentBG = backgroundImages.find((item: any) => item.id === dataSetting.currentBackgroundId)
        dispatch(actions.setTimePomo(dataSetting?.pomodoroTime))
        dispatch(actions.setTimeShort(dataSetting?.shortBreakTime))
        dispatch(actions.setTimeLong(dataSetting?.longBreakTime))
        dispatch(actions.setIsAutoStartBreaks(dataSetting?.autoStartBreak ? true : false))
        dispatch(actions.setIsAutoStartPomo(dataSetting?.autoStartPomodoro ? true : false))
        dispatch(actions.setLongBreakInterval(dataSetting?.longBreakInterval))
        dispatch(actions.setIsDarkMode(dataSetting?.darkmodeWhenRunning ? true : false))
        dispatch(actions.setCustomColorHexPomo(dataSetting?.pomodoroColor))
        dispatch(actions.setCustomColorHexShort(dataSetting?.shortBreakColor))
        dispatch(actions.setCustomColorHexLong(dataSetting?.longBreakColor))
        dispatch(actions.setCurrentCustomColor(dataSetting?.pomodoroColor))
        dispatch(actions.setCurrentAlarmSound(alarmSound))
        dispatch(actions.setCurrentTickingSound(tickingSound))
        setTickingSound(tickingSound)
        dispatch(actions.setCustomBackgroundWallPaper(currentBG?.id === bgNone?.id ? '' : currentBG?.value?.src))
        dispatch(actions.setCurrentBackgroundImage(currentBG?.id === bgNone?.id ? bgNone : currentBG))
        if (currentBG?.id !== bgNone?.id) {
          checkImageBrightness(currentBG?.value?.src)
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
      //get todos
      const dataTodosTemp = window.localStorage.getItem("todosLocal")
      let dataTodos: any
      if (dataTodosTemp) {
        dataTodos = JSON.parse(dataTodosTemp)
        const currentTodo = dataTodos && dataTodos.length > 0 && dataTodos.find((todo: any) => {
          return todo.activePomo === true
        })
        dispatch(actions.setCurrentTask(currentTodo))
        dispatch(actions.setNewTodo(dataTodos))
      }
    }
  }, [user])

  useEffect(() => {
    if (user?.userId) {
      const accessToken = user?.access_token
      getApiTasks(accessToken)
    }
  }, [isAddTodoSuccess, isEditProjectSuccess])

  useEffect(() => {
    if (user?.userId) {
      const accessToken = user?.access_token
      getApiProjects(accessToken)
    }
  }, [isAddProjectSuccess])
  useEffect(() => {
    if (!user?.access_token) {
      setTodosLocal(todos)
    }
    dispatch(actions.setAddTodoSuccess(false))
    dispatch(actions.setEditProjectSuccess(false))
  }, [todos])

  useEffect(() => {
    dispatch(actions.setAddProjectSuccess(false))
  }, [projectList])

  const handleClickAddTodo = () => {
    dispatch(actions.setShowAddTodo(true))
  };
  const handleClickTask = (id: number) => {
    let newTodos = [...todos]
    const itemClicked = newTodos.find((item: any) => {
      return item.id === id
    })
    if (itemClicked.isDone === false) {
      newTodos.forEach((item: any) => {
        item.activePomo = false
      })
      // newTodos[index].activePomo = true
      newTodos = newTodos.map((item: any) => {
        if (item.id === id) {
          item.activePomo = true
        }
        return item
      })
      const newCurrentTask = newTodos.find((item: any) => {
        return item.activePomo === true
      })
      if (user?.access_token) {
        const dataNewCurrentTask = {
          "taskId": newCurrentTask?.id,
          "projectId": newCurrentTask?.project?.projectId,
          "taskName": newCurrentTask?.title,
          "estimatePomodoro": newCurrentTask?.estPomo,
          "note": newCurrentTask?.note,
          "projectName": newCurrentTask?.project?.projectName,
          "actualPomodoro": newCurrentTask?.numAct,
          "status": newCurrentTask?.isDone === false ? "DOING" : "DONE",
        }
        axios
          .patch('/apiDetail/task', dataNewCurrentTask, {
            headers: {
              'authorization': `Bearer ${user?.access_token}`
            }
          })
          .then(res => {
            dispatch(actions.setNewTodo(newTodos))
            dispatch(actions.setCurrentTask(newCurrentTask))
          })
          .catch(err => {
            console.log('error in request', err.response?.data?.message);
          });
      }
      else {
        dispatch(actions.setNewTodo(newTodos))
        dispatch(actions.setCurrentTask(newCurrentTask))
      }
    }
  }
  const handleClickDoneTask = (id: any, e: any) => {
    e.stopPropagation()
    const newTodo = [...todos]
    newTodo.forEach((item: any) => {
      if (item.id === id) {
        item.isDone = !item.isDone
      }
    })
    const itemClicked = newTodo.find((item: any) => {
      return item.id === id
    })
    const dataCurrentTask: any = {
      "taskId": itemClicked?.id,
      "projectId": itemClicked?.project?.projectId,
      "taskName": itemClicked?.title,
      "estimatePomodoro": itemClicked?.estPomo,
      "note": itemClicked?.note,
      "projectName": itemClicked?.project?.projectName,
      "actualPomodoro": itemClicked?.numAct,
      "status": itemClicked?.isDone === true ? "DONE" : itemClicked?.activePomo === true ? "DOING" : "TODO",
    }
    axios
      .patch('/apiDetail/task', dataCurrentTask, {
        headers: {
          'authorization': `Bearer ${user?.access_token}`
        }
      })
      .then(res => {
        dispatch(actions.setNewTodo(newTodo))
      })
      .catch(err => {
        console.log('error in request', err.response?.data?.message);
      });
  }

  const classes = cx('wrapper', 'content', {
    [currentTheme]: !customBackgroundWallpaper ? currentTheme : '',
  });

  const colorBackground = !customBackgroundWallpaper ? isDarkMode && isTimeRunning ? "black" : currentCustomColor : '';

  const handleClickCancelAddTodo = () => dispatch(actions.setShowAddTodo(false))

  return (
    <>
      <main className={styles.main}>
        <div className={classes} style={{
          backgroundColor: `${colorBackground}`,
        }} >
          {playBgSound && (
            <ReactAudioPlayer
              src={tickingSound?.sound?.source}
              autoPlay
              volume={tickingSound?.volume / 100}
              loop
            />
          )}
          {currentTheme === 'pomo' ? (
            <Pomodoro time={pomodoro} />
          ) : (
            <Pomodoro time={currentTheme === 'short' ? shortBreak : longBreak} />
          )}

          {/* version 2 */}
          <div className={cx('add-task')}>
            <div className={cx('heading')}>
              <span className={cx('heading-task')}>Tasks</span>
              <div className={cx('heading-actions')}>
                <Menu items={actionMenu}>
                  <div>
                    <Button className={cx('three-dots')} size="lg">
                      <Image src={images.threeDots} alt="three-dots" />
                    </Button>
                  </div>
                </Menu>
              </div>
            </div>
            <div className={cx('show-tasks')}>
              {todos &&
                todos.length > 0 &&
                todos.map((item: any, index: number) => {
                  if (idShowDetailTask !== item.id) {
                    return (
                      <TaskItem
                        key={item.id} activePomo={item.activePomo} title={item.title} numAct={item.numAct} estPomo={item.estPomo}
                        note={item.note} project={item.project} isDone={item.isDone} onClick={() => handleClickTask(item.id)}
                        onClickThreeDot={() => setIdShowDetailTask(item.id)}
                        onClickDoneTask={(e: any) => handleClickDoneTask(item.id, e)}
                      />
                    );
                  }
                  else {
                    return (
                      <DetailTask key={item.id} isAddTask={false} idTask={item.id} titleTask={item.title}
                        noteTask={item.note} projectTask={item.project} isDoneTask={item.isDone} numActTask={item.numAct}
                        numEstTask={item.estPomo} onSetIdDetailTask={setIdShowDetailTask} />
                    )
                  }
                })}
            </div>
            {!isShowAddTodo ? (
              <div className={cx('add-task-btn')}>
                <Button onClick={handleClickAddTodo}>
                  <Image src={images.plusCircle} alt="plus-circle" />
                  <span>Add Task</span>
                </Button>
              </div>
            ) : (
              <AutoHideComponent>
                <DetailTask isAddTask={true} onClickCancleAddTask={handleClickCancelAddTodo} />
              </AutoHideComponent>
            )}
          </div>
        </div>
        <Modal show={showPremiumPlanReducer} onHide={handleClosePremiumPlan} className='reset-pass-wrapper'>
          <Modal.Body>
            <PremiumPlan onClosePremiumPlan={handleClosePremiumPlan} onShowPremiumPlan={handleShowPremiumPlan} />
          </Modal.Body>
        </Modal>
        {/* <AdBanner
          // data-ad-slot="7412458022"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        /> */}
      </main>
    </>
  );
}
Home.Layout = Layout;
