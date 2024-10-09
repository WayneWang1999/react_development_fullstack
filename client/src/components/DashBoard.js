import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../css/DashBoard.css"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orders: initialOrders } = location.state || { orders: [] }; // Get orders from location state
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState(!initialOrders.length); // Set loading state based on orders length
    const [error, setError] = useState(null);


    useEffect(() => {
        // If orders were not passed as state, fetch from API
        if (!initialOrders.length) {
            const fetchOrders = async () => {
                try {
                    const response = await fetch('/orders'); // Adjust the endpoint as necessary
                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }
                    const data = await response.json();
                    setOrders(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        } else {
            setLoading(false); // If orders are passed, no need to load
        }
    }, [initialOrders]);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    //add for get the menu data
   
    const handleButtonClick_menuEdit = () => {
        navigate('/menuEdit');
    };

    const handleButtonClick = () => {
        navigate('/menu');
    };




  // Function to update order status to 'Ready'
  const handleStatusUpdate = async (orderId) => {
    try {
        //console.log(orderId)
      const response = await fetch(`/owner/orders/${orderId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: 'Ready for Delivery' }), // Update status to 'Ready'
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      // Update the orders state with the updated order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
    // In the component
    return (
        <div className="container-fluid p-0" style={{ height: "100vh" }}>
            <div className="header">
                <button className="top-left-button" onClick={handleButtonClick}>Restaurant Menu</button>
                <button className="top-left-button" onClick={handleButtonClick_menuEdit}>Restaurant Menu Edit</button>
                <button className="top-right-button">Logout</button>
            </div>
            <div className="text-center my-3">
                <h1 className="display-4">Orders Dashboard</h1>
            </div>

            {orders.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: "15%" }}>Customer</th>
                                <th style={{ width: "10%" }}>Phone</th>
                                <th style={{ width: "20%" }}>Delivery Address</th>
                                <th style={{ width: "10%" }}>Order Time</th>
                                <th style={{ width: "10%" }}>Total Price</th>
                                <th style={{ width: "8%" }}>Status</th>
                                <th style={{ width: "10%" }}>Driver</th>
                                <th style={{ width: "10%" }}>License</th>
                                <th style={{ width: "7%" }}>Delivered Image</th>
                                <th style={{ width: "10%" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.customer.firstName} {order.customer.lastName}</td>
                                    <td>{order.customer.phone}</td>
                                    <td className="text-wrap">
                                        {`${order.delivery_Address.street}, ${order.delivery_Address.city}, ${order.delivery_Address.state}, ${order.delivery_Address.zipCode}, ${order.delivery_Address.country}`}
                                    </td>
                                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        {order.orderStatus}
                                    </td>
                                    <td>{order.driver?.firstName || 'Driver info missing'}</td>
                                    <td>{order.driver?.license || 'License info missing'}</td>
                                    <td>
                                        <img
                                            src={order.delivered_image_url}
                                            alt="Delivered"
                                            className="img-fluid img-thumbnail"
                                            width="100"
                                        />
                                    </td>
                                    <td>
                                        <div id="Action_button">
                                            <button className="btn btn-primary btn-sm">View</button>
                                            <button className="btn btn-primary btn-sm" onClick={() =>  handleStatusUpdate(order._id)}>Ready</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center">No orders available.</p>
            )}
        </div>
    );










};

export default Dashboard;

