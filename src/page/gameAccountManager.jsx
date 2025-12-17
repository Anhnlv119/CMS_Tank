import React, { useEffect, useState } from "react";
import Header from "./header.jsx";
import axios from "axios";
import { getToken } from "../utils/sessionManager";

export default function GameAccountManager() {
  const [msisdn, setMsisdn] = useState("");
  const [rewardCode, setRewardCode] = useState("LOYALTY_1000");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const params = new URLSearchParams({
        rewardCode,
        msisdn,
    });

    const response = await axios.post(
      `http://146.88.41.51:8998/dashboard/redeem_code?${params.toString()}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    setData(response.data);
    setMsisdn("");
    setRewardCode("LOYALTY_1000");
    setReason("");
  } catch (error) {
    console.error("Error fetching data:", error);
    setData({ success: false });
  } finally {
    setIsLoading(false);
  }
};


  const checkBoolen = () => {
    if(data.success === true){
      alert("Success");
    } else {
      alert("Failed");
    }
  };

  useEffect(() => {
    if (data.length == 0) return;
    console.log("Data changed:", data);
    checkBoolen();
  }, [data]);

  return (
    <div className="min-vh-100 bg-light p-5 pt-1">
      <div className="container-fluid">
        <Header />
        <div className="container py-5">
          <h1 className="mb-4">GAME ACCOUNT MANAGER</h1>

          <div className="card">
            <div className="card-body p-4">
              <h2 className="card-title h5 mb-4">ADD NEW ACCOUNT BONUS</h2>

              <div className="mb-3 row">
                <label htmlFor="username" className="col-sm-2 col-form-label">
                  User name:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={msisdn}
                    onChange={(e) => setMsisdn(e.target.value)}
                    style={{ maxWidth: "400px" }}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="rewardCode" className="col-sm-2 col-form-label">
                  Reward Code:
                </label>
                <div className="col-sm-10">
                  <select
                    className="form-select"
                    id="rewardCode"
                    value={rewardCode}
                    onChange={(e) => setRewardCode(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  >
                    <option value="LOYALTY_1000">LOYALTY_1000</option>
                    <option value="LOYALTY_500">LOYALTY_500</option>
                    <option value="WELCOME_BONUS">WELCOME_BONUS</option>
                    <option value="REFERRAL_BONUS">REFERRAL_BONUS</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="reason" className="col-sm-2 col-form-label">
                  Reason:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    ADD NEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
