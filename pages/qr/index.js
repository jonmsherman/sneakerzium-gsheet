import { Input, QRCode, Spin } from "antd";
import { useState } from "react";
import waitTime from "../../utils/waitTime";

const { Search } = Input;

const sneakerZiumUrl = "https://sneakerzium-gsheet.vercel.app";

const Qr = () => {
  const [qrStatus, setQrStatus] = useState("active");
  const [qrValue, setQrValue] = useState(sneakerZiumUrl);
  const generateQrCode = async (query) => {
    setQrStatus("loading");
    await waitTime(2000);
    setQrValue(`${sneakerZiumUrl}?query=${query}`);
    setQrStatus("active");
  };

  return (
    <>
      <Search
        allowClear
        enterButton="Generate"
        size="large"
        onSearch={(query) => {
          if (!query) {
            setQrValue(null);
            return;
          }
          generateQrCode(query);
        }}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QRCode size={512} value={qrValue} status={qrStatus} />
      </div>
    </>
  );
};

export default Qr;
