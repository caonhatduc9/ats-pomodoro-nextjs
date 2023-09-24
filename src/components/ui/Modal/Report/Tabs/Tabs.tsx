/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import styles from "./Tabs.module.scss";

export interface TabsProps {
  disableIndex?: number;
  selectedIndex?: number;
  data?: any;
  onChange?: (value?: any) => void;
  style?: any;
}

const Tabs: FC<TabsProps> = ({ ...props }) => {
  const { data, onChange, selectedIndex, disableIndex, style } = props;
  const [item, setItem] = useState(data![0] ? "" : null);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newitem: string
  ) => {
    // console.log(111, "onchange", newitem);
    setItem(newitem);
    onChange && onChange(newitem);
  };

  useEffect(() => {
    data && setItem(data[selectedIndex!]);
  }, []);
  return (
    <ToggleButtonGroup
      color="primary"
      value={item}
      exclusive
      aria-label="tabName"
      className={styles.tabsContainer}
      sx={style}
    >
      {data?.map((item: any, index: Number) => {
        return (
          <ToggleButton
            value={item}
            key={item + index}
            className={styles.itemContainer}
            sx={{
              "&.MuiButtonBase-root.Mui-selected": {
                color: "white",
                background: "orange",
              },
              "&.MuiButtonBase-root:hover": {
                background: "orange",
                color: "white",
              },
            }}
            disabled={index == disableIndex}
            onClick={handleChange}
          >
            {item}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default Tabs;
