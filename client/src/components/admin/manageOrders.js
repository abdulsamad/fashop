import React from "react";

const ManageOrders = () => {
  return (
    <div className="admin-manage-orders">
      <div className="text-center">
        <h3>All Orders</h3>
        <table className="table">
          <thead className="align-middle">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
              <th colSpan={2}>Actions</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            <tr>
              <th scope="row">1</th>
              <td>John Doe</td>
              <td>Mens Wear Jacket Large</td>
              <td>5</td>
              <td>
                <button type="button" className="btn btn-info text-white w-100">
                  More Info
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger text-white w-100">
                  Cancel
                </button>
              </td>
              <td>Delivered</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>John Doe</td>
              <td>Mens Wear Jacket Large</td>
              <td>5</td>
              <td>
                <button type="button" className="btn btn-info text-white w-100">
                  More Info
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger text-white w-100">
                  Cancel
                </button>
              </td>
              <td>
                <button type="button" className="btn btn-outline-success w-100">
                  <i className="bi bi-check" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
