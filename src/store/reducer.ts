import images from "@/assets/images";
import {
  SET_TODO_INPUT,
  SET_THEME,
  SET_EST_INPUT,
  ADD_TODO,
  SET_CURRENT_TIME,
  SET_VALUE_NOTE,
  SET_NUM_POMO,
  SET_LONG_BREAK_INTERVAL,
  SET_NEW_TODO,
  SET_CURRENT_TASK,
  SET_TIME_POMO,
  SET_TIME_SHORT,
  SET_TIME_LONG,
  SET_IS_AUTO_START_BREAKS,
  SET_IS_AUTO_START_POMO,
  SET_IS_AUTO_SWITCH_TASKS,
  SET_CURRENT_ALARM_SOUND,
  SET_CURRENT_TICKING_SOUND,
  SET_IS_CLOSE_SETTING,
  SET_CUSTOM_COLOR_HEX_POMO,
  SET_CUSTOM_COLOR_HEX_SHORT,
  SET_CUSTOM_COLOR_HEX_LONG,
  SET_CUSTOM_BACKGROUND_WALLPAPER,
  SET_CURRENT_CUSTOM_COLOR,
  SET_CURRENT_BACKGROUND_IMAGE,
  SET_IS_DARK_MODE,
  SET_USER,
  SET_SHOW_LOGIN,
  SET_SHOW_RESET_PASS,
  SET_SHOW_SIGN_UP,
  SET_ALARMS,
  SET_TICKINGS,
  SET_BACKGROUNDS,
  SET_BG_NONE,
  SET_SHOW_PROFILE,
  SET_PROJECT_LIST,
  SET_PROJECT,
  SET_SHOW_PROJECTS,
  SET_ADD_TODO_SUCCESS,
  SET_ADD_PROJECT_SUCCESS,
  SET_EDIT_PROJECT_SUCCESS,
  SET_SUMMARY_DATA,
  SET_SHOW_ADD_TODO,
  SET_POMO_BACKGROUND,
  SET_USER_CONFIRM_ADD_TASK,
  SET_STRING_MINUTES,
  SET_TIME_RUNNING,
  SET_OPEN_MENU_TIPPY,
  SET_PLAY_BG_SOUND,
  SET_PERMISSION_NOTI,
  SET_SHOW_PREMIUM_PLAN, SET_IS_PREMIUM,
  SET_SHOW_ALARM_REDUCER,
  SET_COUNT_TASK,
  SET_DEFAULT_SOUND_BACKGROUND,
} from "./constants";
const initState = {
  defaultColorPomo: "#d95550",
  defaultColorShort: "#4c9195",
  defaultColorLong: "#457ca3",
  defaultPomodoro: 25,
  defaultShortBreak: 5, 
  defaultLongBreak: 15,
  defaultIsAutoBreak: false,
  defaultStartPomo: false,
  defaultLongBreakInterval: 4,
  defaultSoundAndBackground:  {
    alarm:{
      sound:  {
        id: 1,
        label: "Alarm Clock",
        value: "alarm-clock",
        source: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
        isFree: 1,
        type: "alarm"
      },
      volume: 50,
      repeat: 1,
    },
    ticking:{
      sound: {
        id: 0,
        label: "None",
        value: "none",
        source: "./sounds/ticking-none.mp3",
        isFree: 1,
        type: "ticking"
      },
      volume: 50,
    },
    backgroundImage: {
      id: 0,
      value: images.bgNone,
      name:"None",
      isFree: 1,
    }
  },
  defaultIsDarkMode: false,
  todos: [],
  currentTask: null,
  projectList: [
    // {
    //     projectId: 0,
    //     projectName: "No project",
    // },
    // {
    //     projectId: 1,
    //     projectName: "hello 1",
    // },
    // {
    //     projectId: 2,
    //     projectName: "hello 1ssssssssssssssssssssssss",
    // },
  ],
  todoInput: "",
  estPomoInput: 1,
  note: "",
  project: null,
  numAct: 0,
  currentTheme: "pomo",
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  numPomo: 0,
  sumEst: 0,
  isAutoStartBreaks: false,
  isAutoStartPomo: false,
  isSwitchTasks: false,
  isDarkMode: false,
  customColorHexPomo: "#d95550",
  customColorHexShort: "#4c9195",
  customColorHexLong: "#457ca3",
  customBackgroundWallpaper: "",
  currentCustomColor: "#d95550",
  alarms: [
    {
      id: 1,
      label: "Alarm Clock",
      value: "alarm-clock",
      source: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
      isFree: 1,
      type: "alarm"
    },
    {
      id: 2,
      label: "Basketball",
      value: "basketball",
      source: "https://actions.google.com/sounds/v1/sports/basketball_bounce_and_roll.ogg",
      isFree: 1,
      type: "alarm"
    },
    {
      id: 3,
      label: "Auto Bullets",
      value: "auto-bullets",
      source: "https://actions.google.com/sounds/v1/weapons/auto_bullets_flyby_short.ogg",
      isFree: 1,
      type: "alarm"
    },
    {
      id: 4,
      label: "Thunder Crack",
      value: "thunder-crack",
      source: "https://actions.google.com/sounds/v1/weather/thunder_crack.ogg",
      isFree: 1,
      type: "alarm"
    },
  ],
  currentAlarmSound: {
    sound:  {
      id: 1,
      label: "Alarm Clock",
      value: "alarm-clock",
      source: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
      isFree: 1,
      type: "alarm"
    },
    volume: 50,
    repeat: 1,
  },
  tickings: [
    {
      id: 0,
      label: "None",
      value: "none",
      source: "./sounds/ticking-none.mp3",
      isFree: 1,
      type: "ticking"
    },
    {
      id: 1,
      label: "Forest",
      value: "forest",
      source: "https://actions.google.com/sounds/v1/weather/forest_wind_summer.ogg",
      isFree: 1,
      type: "ticking"
    },
    {
      id: 2,
      label: "Healing Sleep",
      value: "healing-sleep",
      source: "https://asset.atseeds.com/assets/Healing-sleep-music.mp3",
      isFree: 1,
      type: "ticking"
    },
    {
      id: 3,
      label: "Meditation",
      value: "meditation",
      source: "https://asset.atseeds.com/assets/meditation.m4a",
      isFree: 1,
      type: "ticking"
    },
    {
      id: 4,
      label: "Baroque",
      value: "baroque",
      source: "https://asset.atseeds.com/assets/baroque.m4a",
      isFree: 1,
      type: "ticking"
    },
    {
      id: 5,
      label: "Focus Study Guitar",
      value: "focus-study-guitar",
      source: "https://asset.atseeds.com/assets/focus-study-guita.mp3",
      isFree: 1,
      type: "ticking"
    },
  ],
  currentTickingSound: {
    sound: {
      id: 0,
      label: "None",
      value: "none",
      source: "./sounds/ticking-none.mp3",
      isFree: 1,
      type: "ticking"
    },
    volume: 50,
  },
  //blog:
  blogs: [
    {
      id: 1,
      Heading: "h1",
      headContent: "An online Pomodoro Timer to boost your productivity",
    },
    {
      id: 2,
      headContent: "What is Pomodoro?",
      contentP:
        "Pomodoro is a customizable pomodoro timer that works on desktop & mobile browser. The aim of this app is to help you focus on any task you are working on, such as study, writing, or coding. This app is inspired by Pomodoro Technique which is a time management method developed by Francesco Cirillo.",
    },
    {
      id: 3,
      headContent: "How to use the Pomodoro Timer?",
      TagContent: "ol",
      isOl: true,
      contentList: [
        "Add tasks to work on today",
        "Set estimate pomodoros (1 = 25min of work) for each tasks",
        "Select a task to work on",
        "Start timer and focus on the task for 25 minutes",
        "Take a break for 5 minutes when the alarm ring",
        "Iterate 3-5 until you finish the tasks",
      ],
    },
    {
      id: 4,
      headContent: "Features",
      TagContent: "ul",
      isOl: false,
      contentList: [
        "Add tasks to work on today",
        "Set estimate pomodoros (1 = 25min of work) for each tasks",
        "Select a task to work on",
        "Start timer and focus on the task for 25 minutes",
        "Take a break for 5 minutes when the alarm ring",
        "Iterate 3-5 until you finish the tasks",
      ],
    },
  ],
  isCloseSetting: true,
  bgNone: {
    id: 0,
    value: images.bgNone,
    name:"None",
    isFree: 1,
  },
  backgroundImages: [
    {
      id: 1,
      value: {src:"https://res.cloudinary.com/dplgegcm0/image/upload/v1692193419/ATS/Pomodoro/muikega-bg_mhvxqz.jpg"},
      name:"bg1",
      isFree: 1,
    },
    {
      id: 2,
      value: {src:"https://res.cloudinary.com/dplgegcm0/image/upload/v1692193418/ATS/Pomodoro/waterfall-bg_qtkkxl.jpg"},
      name:"bg2",
      isFree: 1,
    },
    {
      id: 3,
      value: {src:"https://res.cloudinary.com/dplgegcm0/image/upload/v1692193418/ATS/Pomodoro/flower_bg_w3j9d8.jpg"},
      name:"bg3",
      isFree: 1,
    },
    {
      id: 4,
      value: {src:"https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60"},
      name:"bg4",
      isFree: 1,
    },
    {
      id: 5,
      value: {src:"https://images.unsplash.com/photo-1548263594-a71ea65a8598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60"},
      name:"bg5",
      isFree: 1,
    },
    {
      id: 0,
      value: images.bgNone,
      name:"None",
      isFree: 1,
    },
  ],
  currentBackgroundImage: {
    id: 0,
    value: images.bgNone,
    name:"None",
    isFree: 1,
  },
  user: {
    access_token: "",
    avatarURL: "",
    payment: "free",
    userId: "",
    userName: "",
  },
  showLoginReducer: false,
  showResetPassReducer: false,
  showSignUpReducer: false,
  showProfileReducer: false,
  showProjectsReducer: false,
  isAddTodoSuccess: false,
  isAddProjectSuccess: false,
  isEditProjectSuccess: false,
  version: 1,
  isShowAddTodo: false,
  pomoBackground:'rgba(0, 0, 0, 0.10)',
  closeSetting: true, 
  isUserConfirmAddTask: false,
  stringMinutes:'', 
  isTimeRunning: false,
  isOpenMenuTippy: true,
  playBgSound: false,
  isPermissionNoti: false,
  showPremiumPlanReducer:false,
  isPremium: false,
  isShowAlarmReducer: false,
  countTask: 0
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        currentTheme: action.payload,
      };
    case SET_TODO_INPUT:
      return {
        ...state,
        todoInput: action.payload,
      };
    case SET_EST_INPUT:
      return {
        ...state,
        estPomoInput: action.payload,
      };
    case SET_NUM_POMO:
      return {
        ...state,
        numPomo: action.payload,
      };
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: action.payload.id,
            numAct: 0,
            note: action.payload.note,
            project: action.payload.project,
            title: action.payload.todoInput,
            estPomo: action.payload.estPomo,
            activePomo: false,
            isDone: false,
          },
        ],
      };
    case SET_NEW_TODO:
      return {
        ...state,
        todos: action.payload,
      };
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };
    case SET_CURRENT_TASK:
      return {
        ...state,
        currentTask: action.payload,
      };
    case SET_VALUE_NOTE:
      return {
        ...state,
        note: action.payload,
      };
    case SET_LONG_BREAK_INTERVAL:
      return {
        ...state,
        longBreakInterval: action.payload,
      };
    case SET_TIME_POMO:
      return {
        ...state,
        pomodoro: action.payload,
      };
    case SET_TIME_SHORT:
      return {
        ...state,
        shortBreak: action.payload,
      };
    case SET_TIME_LONG:
      return {
        ...state,
        longBreak: action.payload,
      };
    case SET_IS_AUTO_START_BREAKS:
      return {
        ...state,
        isAutoStartBreaks: action.payload,
      };
    case SET_IS_AUTO_START_POMO:
      return {
        ...state,
        isAutoStartPomo: action.payload,
      };
    case SET_IS_AUTO_SWITCH_TASKS:
      return {
        ...state,
        isAutoSwitchTasks: action.payload,
      };
    case SET_CURRENT_ALARM_SOUND:
      return {
        ...state,
        currentAlarmSound: action.payload,
      };
    case SET_CURRENT_TICKING_SOUND:
      return {
        ...state,
        currentTickingSound: action.payload,
      };
    case SET_IS_CLOSE_SETTING:
      return {
        ...state,
        isCloseSetting: action.payload,
      };
    case SET_CUSTOM_COLOR_HEX_POMO:
      return {
        ...state,
        customColorHexPomo: action.payload,
      };
    case SET_CUSTOM_COLOR_HEX_SHORT:
      return {
        ...state,
        customColorHexShort: action.payload,
      };
    case SET_CUSTOM_COLOR_HEX_LONG:
      return {
        ...state,
        customColorHexLong: action.payload,
      };
    case SET_CUSTOM_BACKGROUND_WALLPAPER:
      return {
        ...state,
        customBackgroundWallpaper: action.payload,
      };
    case SET_CURRENT_CUSTOM_COLOR:
      return {
        ...state,
        currentCustomColor: action.payload,
      };
    case SET_CURRENT_BACKGROUND_IMAGE:
      return {
        ...state,
        currentBackgroundImage: action.payload,
      };
    case SET_IS_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_SHOW_LOGIN:
      return {
        ...state,
        showLoginReducer: action.payload,
      };
    case SET_SHOW_RESET_PASS:
      return {
        ...state,
        showResetPassReducer: action.payload,
      };
    case SET_SHOW_SIGN_UP:
      return {
        ...state,
        showSignUpReducer: action.payload,
      };
    case SET_ALARMS:
      return {
        ...state,
        alarms: action.payload,
      };
    case SET_TICKINGS:
      return {
        ...state,
        tickings: action.payload,
      };
    case SET_BACKGROUNDS:
      return {
        ...state,
        backgroundImages: action.payload,
      };
    case SET_BG_NONE:
      return {
        ...state,
        bgNone: action.payload,
      };
    case SET_SHOW_PROFILE:
      return {
        ...state,
        showProfileReducer: action.payload,
      };
    case SET_PROJECT_LIST:
      return {
        ...state,
        projectList: action.payload,
      };
    case SET_SHOW_PROJECTS:
      return {
        ...state,
        showProjectsReducer: action.payload,
      };
    case SET_PROJECT:
      return {
        ...state,
        project: action.payload,
      };
    case SET_ADD_TODO_SUCCESS:
      return {
        ...state,
        isAddTodoSuccess: action.payload,
      };
    case SET_ADD_PROJECT_SUCCESS:
      return {
        ...state,
        isAddProjectSuccess: action.payload,
      };
    case SET_EDIT_PROJECT_SUCCESS:
      return {
        ...state,
        isEditProjectSuccess: action.payload,
      };
    case SET_SUMMARY_DATA:
      return {
        ...state,
      };
    case SET_SHOW_ADD_TODO:
      return {
        ...state,
        isShowAddTodo: action.payload,
      };
    case SET_POMO_BACKGROUND:
      return {
        ...state,
        pomoBackground: action.payload,
      };
    case SET_USER_CONFIRM_ADD_TASK:
      return {
        ...state,
        isUserConfirmAddTask: action.payload,
      };
    case SET_STRING_MINUTES:
      return {
        ...state,
        stringMinutes: action.payload,
      };
    case SET_TIME_RUNNING:
      return {
        ...state,
        isTimeRunning: action.payload,
      };
    case SET_OPEN_MENU_TIPPY:
      return {
        ...state,
        isOpenMenuTippy: action.payload,
      };
    case SET_PLAY_BG_SOUND:
      return {
        ...state,
        playBgSound: action.payload,
      };
    case SET_PERMISSION_NOTI:
      return {
        ...state,
        isPermissionNoti: action.payload,
      };
    case SET_SHOW_PREMIUM_PLAN:
      return {
          ...state,
          showPremiumPlanReducer: action.payload
      }
      case SET_IS_PREMIUM:
        return {
            ...state,
            isPremium: action.payload
        }
    case SET_SHOW_ALARM_REDUCER:
      return {
        ...state,
        isShowAlarmReducer: action.payload,
      };
    case SET_COUNT_TASK:
      return {
        ...state,
        countTask: action.payload,
      }
    case SET_DEFAULT_SOUND_BACKGROUND:
      return {
        ...state,
        defaultSoundAndBackground: action.payload,
      }
    default:
      throw new Error("Invalid action");
  }
}

export { initState };
export default reducer;
