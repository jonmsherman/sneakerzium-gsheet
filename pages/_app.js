import "antd/dist/reset.css";
import { Layout } from "antd";

export default function App({ Component, pageProps }) {
  return (
    <Layout style={{ padding: "32px", minHeight: "100vh" }}>
      <Component {...pageProps} />
    </Layout>
  );
}
