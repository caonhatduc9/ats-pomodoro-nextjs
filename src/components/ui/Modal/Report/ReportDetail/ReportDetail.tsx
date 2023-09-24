import { FC, memo } from "react";
import { Table } from "antd";
const { Column } = Table;
interface ReportDetailProps {
  data?: any;
}
const ReportDetail: FC<ReportDetailProps> = ({ ...props }) => {
  const dataDisplay = props.data.reportDetailData;
  return (
    <Table
      dataSource={dataDisplay ? dataDisplay : []}
      style={{
        border: "0.5px solid rgb(187, 187, 187)",
        borderRadius: 8,
        marginBottom: 20,
        overflow: "hidden",
      }}
      pagination={false}
      key="table"
    >
      <Column title="Date" dataIndex="date" key="date" />
      <Column title="Task" dataIndex="task" key="task" />
      <Column title="Minutes" dataIndex="minutes" key="minutes" />
    </Table>
  );
};

export default memo(ReportDetail);
