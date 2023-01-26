import { useEffect, useState } from "react";
import { Drawer, Checkbox, List, Typography, Button, Space } from "antd";

const { Text } = Typography;

const FilterDrawer = ({ isOpen, onClose, sizes, onFilter }) => {
  const [checked, setChecked] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (sizes && isOpen) {
      setChecked(sizes);
    }
  }, [isOpen, sizes]);

  useEffect(() => {
    if (checked) {
      let total = 0;
      checked.forEach((size) => (total += size.total));
      setTotal(checked.reduce((total, size) => (total += size.total), 0));
    }
  }, [checked]);

  return (
    <Drawer
      title="Sizes"
      placement="right"
      onClose={onClose}
      open={isOpen}
      footer={
        <div
          style={{
            padding: "8px 4px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Space>
            <Button
              type="default"
              disabled={checked.length === 0}
              onClick={() => setChecked([])}
            >
              Clear All
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const sizes = checked.map((size) => size.size);
                onFilter(sizes);
              }}
            >
              Show ({total}) Results
            </Button>
          </Space>
        </div>
      }
    >
      <Checkbox.Group
        style={{ width: "100%" }}
        value={checked}
        onChange={(checkedValues) => {
          console.log(checkedValues);
          setChecked(checkedValues);
        }}
      >
        <List
          dataSource={sizes}
          renderItem={(size) => (
            <List.Item>
              <Checkbox value={size}>
                <Text>
                  {size.size}
                  <Text strong>{` (${size.total})`}</Text>
                </Text>
              </Checkbox>
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </Drawer>
  );
};

export default FilterDrawer;
