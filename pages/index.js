import { Input, Image, Table, Space, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import FilterDrawer from "../components/filter-drawer/FilterDrawer";

const { Search } = Input;

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [shoes, setShoes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { query } = router.query;

  useEffect(() => {
    if (query) setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    search();
  }, [searchQuery]);

  const search = async (sizesFilter) => {
    setIsSearching(true);
    setShoes([]);
    setSizes([]);
    try {
      let url = "/api/gsheet";

      if (searchQuery) {
        url += `?search=${searchQuery}`;

        if (sizesFilter) url += `&sizes=${JSON.stringify(sizesFilter)}`;
      } else {
        if (sizesFilter) url += `?sizes=${JSON.stringify(sizesFilter)}`;
      }
      const { data } = await axios.get(url);
      const { shoes, sizes } = data;
      setShoes(shoes);
      setSizes(sizes);
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
          onSearch={(query) => setSearchQuery(query)}
        />
        <Button
          type="primary"
          size="large"
          onClick={() => setIsDrawerOpen(true)}
        >
          Filter
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={shoes}
        loading={isSearching}
        pagination={{
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sizes={sizes}
        onFilter={(sizes) => search(sizes)}
      />
    </>
  );
}
