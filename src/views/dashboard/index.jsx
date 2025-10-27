import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PieDonutChart from 'views/charts/nvd3-chart/chart/PieDonutChart';
import axiosInstance from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_APP_API_URL;

const DashDefault = () => {
  const [orderStats, setOrderStats] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalAll: 0
  });

  const [orders, setOrders] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("Users"));
  const userId = user?.userIdLogin;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/api/admin/order/list`);
        const ordersData = res.data?.data || [];

        let totalPaid = 0;
        let totalUnpaid = 0;
        let totalAll = 0;

        ordersData.forEach((order) => {
          const price = parseFloat(order.TotalPrice) || 0;
          totalAll += price;
          if (order.Status === 3) totalPaid += price;
          else if (order.Status === 1) totalUnpaid += price;
        });

        setOrders(ordersData);
        setOrderStats({ totalPaid, totalUnpaid, totalAll });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []);

  const computedSalesData = [
    {
      title: 'Tổng tiền đơn đã thanh toán',
      amount: `${orderStats.totalPaid.toLocaleString()} VND`,
      icon: '',
      value: 100,
      class: 'progress-c-theme'
    },
    {
      title: 'Tổng tiền đơn chưa thanh toán',
      amount: `${orderStats.totalUnpaid.toLocaleString()} VND`,
      icon: '',
      value: 100,
      class: 'progress-c-theme2'
    },
    {
      title: 'Tổng tiền dự tính',
      amount: `${orderStats.totalAll.toLocaleString()} VND`,
      icon: '',
      value: 100,
      class: 'progress-c-theme'
    }
  ];

  const statusColorMap = {
    'Chưa thanh toán': '#f4c22b',
    'Đã thanh toán': '#04a9f5',
    'Đơn huỷ': '#ff8a65',
    'Đã hoàn thành': '#1de9b6'
  };

  const statusData = [
    { label: 'Chưa thanh toán', value: orders.filter((o) => o.Status === 2).length, color: statusColorMap['Chưa thanh toán'] },
    { label: 'Đã thanh toán', value: orders.filter((o) => o.Status === 1).length, color: statusColorMap['Đã thanh toán'] },
    { label: 'Đơn huỷ', value: orders.filter((o) => o.Status === 0).length, color: statusColorMap['Đơn huỷ'] },
    { label: 'Đã hoàn thành', value: orders.filter((o) => o.Status === 3).length, color: statusColorMap['Đã hoàn thành'] }
  ];

  return (
    <React.Fragment>
      <Row>
        {computedSalesData.map((data, index) => (
          <Col key={index} xl={6} xxl={4}>
            <Card>
              <Card.Body>
                <h6 className="mb-4">{data.title}</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                    </h3>
                  </div>
                  <div className="col-3 text-end">
                    <p className="m-b-0">{data.value}%</p>
                  </div>
                </div>
                <div className="progress m-t-30" style={{ height: '7px' }}>
                  <div
                    className={`progress-bar ${data.class}`}
                    role="progressbar"
                    style={{ width: `${data.value}%` }}
                    aria-valuenow={data.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
<div style={{ display:'flex' ,alignItems:'center',justifyContent:'center'}}>
        <div
          style={{
            backgroundColor: 'lightgrey',
            padding: '20px',
            borderRadius: '10px',
            marginLeft: '20px',
          }}
        >
          <PieDonutChart data={statusData} />
          <div style={{ marginTop: '20px' }}>
            {statusData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: item.color,
                    marginRight: '8px',
                    borderRadius: '4px'
                  }}
                >

                </div>
                <span style={{ color: 'black' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
