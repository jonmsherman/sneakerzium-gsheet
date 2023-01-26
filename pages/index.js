import { Input, Image, Table, Space, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { query } = router.query;

  useEffect(() => {
    if (query) search(query);
  }, [query]);

  const search = async (searchQuery) => {
    setIsSearching(true);
    setSearchResults(null);
    try {
      let url = "/api/gsheet";

      if (searchQuery) {
        url += `?search=${searchQuery}`;
      }
      const { data } = await axios.get(url);
      console.log(data);
      setSearchResults(data);
    } catch (err) {
      console.log(err);
    }
    setIsSearching(false);
  };

  const columns = [
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      key: "name",
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      render: (shoe) => {
        const image = shoe.image;
        if (image)
          return (
            <Space>
              {shoe.name}
              <Image width={50} src={image} />
            </Space>
          );
        return shoe.name;
      },
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
  ];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Search
          allowClear
          enterButton="Search"
          size="large"
          onSearch={(query) => {
            if (!query) return;
            search(query);
          }}
        />
        <Button type="primary" size="large">
          Filter
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={searchResults}
        loading={isSearching}
        pagination={false}
      />
    </>
  );
}
