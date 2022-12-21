import { Input } from "antd";
const { Search } = Input;
import { Table } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const columns = [
  {
    title: "Sku",
    dataIndex: "sku",
    key: "sku",
  },
  // {
  //   title: "Image",
  //   dataIndex: "image",
  //   key: "image",
  //   render: (image) => {
  //     if (image) return <img style={{ height: 75, width: 75 }} src={image} />;
  //   },
  // },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
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

  return (
    <>
      <Search
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(query) => {
          if (!query) return;
          search(query);
        }}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={searchResults}
        loading={isSearching}
        pagination={false}
      />
    </>
  );
}
