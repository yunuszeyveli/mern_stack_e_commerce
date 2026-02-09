import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, Alert } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
    monthlyProductSales: [],
    monthlyCustomers: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/stats");

        if (!response.ok) {
          throw new Error("İstatistikler yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Hata:", err);
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
        <Spin size="large" tip="İstatistikler yükleniyor..." fullscreen />
      );
  }

  return (
    <div>
      {error && (
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: "20px" }}
        />
      )}

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={stats.totalRevenue}
              prefix="$"
              precision={2}
              styles={{ content: { color: "#1890ff" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Ürün Satışı"
              value={stats.totalProductsSold}
              styles={{ content: { color: "#52c41a" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Müşteri"
              value={stats.totalCustomers}
              styles={{ content: { color: "#fa8c16" } }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: "20px" }}>
        <h2>Son 6 Aydaki Ürün Satış Artışı</h2>
        {stats.monthlyProductSales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyProductSales}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="satilanUrunSayisi"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Satılan Ürün"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Veri yok</p>
        )}
      </Card>

      <Card style={{ marginTop: "20px" }}>
        <h2>Son 6 Aydaki Müşteri Artışı</h2>
        {stats.monthlyCustomers.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyCustomers}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="musteriSayisi"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
                name="Müşteri Sayısı"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Veri yok</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;