import React, { useEffect, useState } from "react";
import Header from "./header.jsx";
import { getToken } from "../utils/sessionManager";

export default function GameAccountManager() {
  const [msisdn, setMsisdn] = useState("");
  const [rewardCode, setRewardCode] = useState("LOYALTY_1000");
  const [reason, setReason] = useState("");
  const [, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currencyType, setCurrencyType] = useState("GOLD");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const url = `http://146.88.41.51:8998/dashboard/redeem_code?rewardCode=${rewardCode}&msisdn=${msisdn}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Response:", response);
      const json = await response.json();
      setData(json);
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

  useEffect(() => {
    if (!data) return;

    if (data.success === true) {
      alert("Success");
    } else {
      alert("Failed");
    }
  }, [data]);

  const handleAddCurrency = async () => {
    setIsLoading(true);

    let endpoint = "";

    switch (currencyType) {
      case "GOLD":
        endpoint = "/currency/coin";
        break;
      case "DIAMOND":
        endpoint = "/currency/gem";
        break;
      case "TICKET":
        endpoint = "/currency/playticket";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(`http://146.88.41.51:8998${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          player_id: msisdn,
          amount: Number(amount),
        }),
      });

      const json = await response.json();
      setData(json);
      setAmount("");
      setMsisdn("");
    } catch (error) {
      console.error(error);
      setData({ success: false });
    } finally {
      setIsLoading(false);
    }
  };

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
                    <option value="TANKS_DAILY">TANKS_DAILY</option>
                    <option value="TANKS_WEEKLY">TANKS_WEEKLY</option>
                    <option value="TANKS_MONTHLY">TANKS_MONTHLY</option>
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
          <hr />
          <div className="card">
            <div className="card-body p-4">
              <h2 className="card-title h5 mb-4">
                ADD GOLD - DIAMOND - TICKET
              </h2>

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
                    value={currencyType}
                    onChange={(e) => setCurrencyType(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  >
                    <option value="GOLD">GOLD</option>
                    <option value="DIAMOND">DIAMOND</option>
                    <option value="TICKET">TICKET</option>
                  </select>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="reason" className="col-sm-2 col-form-label">
                  Value:
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddCurrency}
                  >
                    ADD
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
