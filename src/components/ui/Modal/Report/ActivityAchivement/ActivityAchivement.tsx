import { FC } from "react";
import { Grid } from "@mui/material";
import styles from "./ActivityAchivement.module.scss";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
interface ActivityAchivementProps {
  icon?: string;
  value?: number;
  desc?: string;
  onChange?: () => void;
}

type activityIcon = {
  [key: string]: any;
};

const icons: activityIcon = {
  "ic-fire": WhatshotIcon,
  "ic-alarm": AccessAlarmIcon,
  "ic-calendar": CalendarMonthIcon,
};

const ActivityAchivement: FC<ActivityAchivementProps> = ({ ...props }) => {
  const { icon, value, desc } = props;
  return (
    <div className={styles.activityAchivementWrapper}>
      <Grid container sx={{ textAlign: "left", alignItems: "center" }}>
        <Grid item xs={6}>
          {icon && icon == "ic-alarm" ? (
            <AccessAlarmIcon
              style={{ width: 32, height: 32 }}
            ></AccessAlarmIcon>
          ) : null}
          {icon && icon == "ic-fire" ? (
            <WhatshotIcon style={{ width: 32, height: 32 }}></WhatshotIcon>
          ) : null}
          {icon && icon == "ic-calendar" ? (
            <CalendarMonthIcon
              style={{ width: 32, height: 32 }}
            ></CalendarMonthIcon>
          ) : null}
        </Grid>
        {value != undefined ? (
          <Grid
            item
            xs={6}
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {value}
          </Grid>
        ) : null}
        {desc ? (
          <Grid
            item
            xs={12}
            sx={{
              textAlign: "right",
              marginTop: "0.5rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            {desc}
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

export default ActivityAchivement;
