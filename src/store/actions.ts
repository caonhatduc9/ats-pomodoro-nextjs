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

export const setTodoInput = (payload: any) => ({
  type: SET_TODO_INPUT,
  payload,
});

export const setTheme = (payload: any) => ({
  type: SET_THEME,
  payload,
});

export const setEstInput = (payload: any) => ({
  type: SET_EST_INPUT,
  payload,
});

export const saveAddTodo = (payload: any) => ({
  type: ADD_TODO,
  payload,
});

export const setCurrentTime = (payload: any) => ({
  type: SET_CURRENT_TIME,
  payload,
});

export const setValueNote = (payload: any) => ({
  type: SET_VALUE_NOTE,
  payload,
});

export const setProject = (payload: any) => ({
  type: SET_PROJECT,
  payload,
});

export const setNumPomo = (payload: any) => ({
  type: SET_NUM_POMO,
  payload,
});

export const setLongBreakInterval = (payload: any) => ({
  type: SET_LONG_BREAK_INTERVAL,
  payload,
});

export const setNewTodo = (payload: any) => ({
  type: SET_NEW_TODO,
  payload,
});

export const setCurrentTask = (payload: any) => ({
  type: SET_CURRENT_TASK,
  payload,
});

export const setTimePomo = (payload: any) => ({
  type: SET_TIME_POMO,
  payload,
});

export const setTimeShort = (payload: any) => ({
  type: SET_TIME_SHORT,
  payload,
});

export const setTimeLong = (payload: any) => ({
  type: SET_TIME_LONG,
  payload,
});

export const setIsAutoStartBreaks = (payload: any) => ({
  type: SET_IS_AUTO_START_BREAKS,
  payload,
});

export const setIsAutoStartPomo = (payload: any) => ({
  type: SET_IS_AUTO_START_POMO,
  payload,
});

export const setIsAutoSWitchTasks = (payload: any) => ({
  type: SET_IS_AUTO_SWITCH_TASKS,
  payload,
});

export const setCurrentAlarmSound = (payload: any) => ({
  type: SET_CURRENT_ALARM_SOUND,
  payload,
});

export const setCurrentTickingSound = (payload: any) => ({
  type: SET_CURRENT_TICKING_SOUND,
  payload,
});

export const setIsCloseSetting = (payload: any) => ({
  type: SET_IS_CLOSE_SETTING,
  payload,
});

export const setCustomColorHexPomo = (payload: any) => ({
  type: SET_CUSTOM_COLOR_HEX_POMO,
  payload,
});

export const setCustomColorHexShort = (payload: any) => ({
  type: SET_CUSTOM_COLOR_HEX_SHORT,
  payload,
});

export const setCustomColorHexLong = (payload: any) => ({
  type: SET_CUSTOM_COLOR_HEX_LONG,
  payload,
});

export const setCustomBackgroundWallPaper = (payload: any) => ({
  type: SET_CUSTOM_BACKGROUND_WALLPAPER,
  payload,
});

export const setCurrentCustomColor = (payload: any) => ({
  type: SET_CURRENT_CUSTOM_COLOR,
  payload,
});

export const setCurrentBackgroundImage = (payload: any) => ({
  type: SET_CURRENT_BACKGROUND_IMAGE,
  payload,
});

export const setIsDarkMode = (payload: any) => ({
  type: SET_IS_DARK_MODE,
  payload,
});

export const setUser = (payload: any) => ({
  type: SET_USER,
  payload,
});

export const setShowLogin = (payload: any) => ({
  type: SET_SHOW_LOGIN,
  payload,
});

export const setShowResetPass = (payload: any) => ({
  type: SET_SHOW_RESET_PASS,
  payload,
});

export const setShowSignUp = (payload: any) => ({
  type: SET_SHOW_SIGN_UP,
  payload,
});

export const setAlarms = (payload: any) => ({
  type: SET_ALARMS,
  payload,
});

export const setTickings = (payload: any) => ({
  type: SET_TICKINGS,
  payload,
});

export const setBackgounds = (payload: any) => ({
  type: SET_BACKGROUNDS,
  payload,
});

export const setBGNone = (payload: any) => ({
  type: SET_BG_NONE,
  payload,
});

export const setShowProfile = (payload: any) => ({
  type: SET_SHOW_PROFILE,
  payload,
});

export const setShowProjects = (payload: any) => ({
  type: SET_SHOW_PROJECTS,
  payload,
});

export const setShowPremiumPlan =  (payload: any) => ({
    type: SET_SHOW_PREMIUM_PLAN,
    payload,
});

export const setProjectList =  (payload: any) => ({
    type: SET_PROJECT_LIST,
    payload,
});

export const setAddTodoSuccess = (payload: any) => ({
  type: SET_ADD_TODO_SUCCESS,
  payload,
});

export const setAddProjectSuccess = (payload: any) => ({
  type: SET_ADD_PROJECT_SUCCESS,
  payload,
});

export const setEditProjectSuccess = (payload: any) => ({
  type: SET_EDIT_PROJECT_SUCCESS,
  payload,
});

export const setIsPremium =  (payload: any) => ({
    type: SET_IS_PREMIUM,
    payload
});

export const setSummaryData = (payload: any) => ({
  type: SET_SUMMARY_DATA,
  payload,
});

export const setShowAddTodo = (payload: any) => ({
  type: SET_SHOW_ADD_TODO,
  payload,
});

export const setPomoBackground = (payload: any) => ({
  type: SET_POMO_BACKGROUND,
  payload,
});

export const setUserConfirmAddTask = (payload: any) => ({
  type: SET_USER_CONFIRM_ADD_TASK,
  payload,
});

export const setStringMinutes = (payload: any) => ({
  type: SET_STRING_MINUTES,
  payload,
});

export const setTimeRunning = (payload: any) => ({
  type: SET_TIME_RUNNING,
  payload,
});

export const setOpenMenuTippy = (payload: any) => ({
  type: SET_OPEN_MENU_TIPPY,
  payload,
});

export const setPlayBgSound = (payload: any) => ({
  type: SET_PLAY_BG_SOUND,
  payload,
});

export const setPermissionNoti = (payload: any) => ({
  type: SET_PERMISSION_NOTI,
  payload,
});

export const setShowAlarmReducer = (payload: any) => ({
  type: SET_SHOW_ALARM_REDUCER,
  payload,
});

export const setCountTask = (payload: any) => ({
  type: SET_COUNT_TASK,
  payload,
});

export const setDefaultSoundBackground = (payload: any) => ({
  type: SET_DEFAULT_SOUND_BACKGROUND,
  payload,
});


