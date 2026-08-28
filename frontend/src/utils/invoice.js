import { getOrderShippingCharge } from "./shipping.js";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const openInvoiceWindow = (order, { title = "DesignsByShakshi Invoice" } = {}) => {
  if (!order) return;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number.isFinite(Number(order.subtotal))
    ? Number(order.subtotal)
    : items.reduce((sum, it) => sum + (it.quantity || 0) * (it.priceAtOrderTime || 0), 0);
  const couponDiscount = Number(order.discountAmount || 0);
  const totalAmount = Number(order.totalAmount || subtotal);
  const deliveryCharge = getOrderShippingCharge(order);
  const invoiceNo = `INV-${order.orderNumber || (order._id || "").slice(-6)}`;
  const address = order.address
    ? `${order.address.street || ""}, ${order.address.city || ""}, ${order.address.state || ""} - ${order.address.pincode || ""}`
    : "-";

  const rows = items
    .map((it, idx) => {
      const qty = Number(it.quantity || 0);
      const unit = Number(it.priceAtOrderTime || 0);
      const amount = qty * unit;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${esc(it.product?.name || "Product")}</td>
          <td>${qty}</td>
          <td>${formatCurrency(unit)}</td>
          <td>${formatCurrency(amount)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>${esc(title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      margin: 0;
      padding: 16px;
      color: #111827;
      -webkit-text-size-adjust: 100%;
    }
    .wrap {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    .head {
      background: #1f2d46;
      color: #fff;
      padding: 20px 16px;
      text-align: center;
    }
    .head-logo {
      display: block;
      width: 72px;
      height: 72px;
      object-fit: contain;
      margin: 0 auto 10px;
    }
    .head h1 { margin: 0; font-size: 24px; line-height: 1.2; }
    .head p { margin: 8px 0 0; font-size: 13px; line-height: 1.5; opacity: 0.95; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      padding: 18px;
    }
    .box {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 12px;
      min-width: 0;
    }
    .box h3 {
      margin: 0 0 10px;
      font-size: 13px;
      text-transform: uppercase;
      color: #374151;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
      line-height: 1.45;
      margin: 6px 0;
      word-break: break-word;
    }
    .row strong { text-align: right; font-weight: 600; }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0 18px 14px;
    }
    table {
      width: 100%;
      min-width: 520px;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f9fafb; white-space: nowrap; }
    .totals-row {
      display: flex;
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 16px;
      padding: 0 18px 18px;
    }
    .sum {
      width: 100%;
      max-width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }
    .sum .row { padding: 10px 12px; margin: 0; }
    .sum .total { background: #1f2d46; color: #fff; font-weight: 700; }
    .invoice-actions { display: flex; justify-content: stretch; }
    .invoice-actions button {
      width: 100%;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
    .download-btn { background: #1f2d46; color: #fff; }

    @media (min-width: 640px) {
      body { padding: 20px; }
      .head { padding: 18px 20px; }
      .head h1 { font-size: 28px; }
      .totals-row {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
      }
      .sum { max-width: 320px; margin-left: auto; }
      .invoice-actions { justify-content: flex-start; }
      .invoice-actions button { width: auto; font-size: 13px; padding: 10px 14px; }
    }

    @media (max-width: 639px) {
      body { padding: 0; background: #fff; }
      .wrap { border: none; border-radius: 0; min-height: 100vh; }
      .grid { grid-template-columns: 1fr; padding: 14px; gap: 12px; }
      .table-wrap { padding: 0 14px 14px; }
      .totals-row { padding: 0 14px 16px; }
      .row { font-size: 14px; }
      .head h1 { font-size: 22px; }
    }

    @media print {
      body { background: #fff; padding: 0; }
      .wrap { border: none; border-radius: 0; min-height: auto; }
      .invoice-actions { display: none; }
      .totals-row { padding: 0 18px 18px; flex-direction: row; }
      .sum { max-width: 320px; margin-left: auto; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <img
        class="head-logo"
        src="https://res.cloudinary.com/dbfooaz44/image/upload/v1775117601/Untitled_600_x_600_px_3_iujtam.png"
        alt="Design By Sakshi"
      />
      <h1>DesignsByShakshi</h1>
      <p>Jewellery Invoice | designsbyshakshi@gmail.com | 9130383655</p>
    </div>
    <div class="grid">
      <div class="box">
        <h3>Invoice & Order</h3>
        <div class="row"><span>Invoice Date</span><strong>${esc(formatDateTime(new Date()))}</strong></div>
        <div class="row"><span>Order No</span><strong>#${esc(order.orderNumber || (order._id || "").slice(-6))}</strong></div>
        <div class="row"><span>Invoice No</span><strong>${esc(invoiceNo)}</strong></div>
        <div class="row"><span>Order Date</span><strong>${esc(formatDateTime(order.createdAt))}</strong></div>
        <div class="row"><span>Order Status</span><strong>${esc(order.status || "-")}</strong></div>
        <div class="row"><span>Payment Status</span><strong>${esc(order.paymentStatus || "unpaid")}</strong></div>
        <div class="row"><span>Payment Mode</span><strong>${esc(order.paymentMode || "-")}</strong></div>
      </div>
      <div class="box">
        <h3>Bill To</h3>
        <div class="row"><span>Name</span><strong>${esc(order.name || "-")}</strong></div>
        <div class="row"><span>Email</span><strong>${esc(order.email || "-")}</strong></div>
        <div class="row"><span>Phone</span><strong>${esc(order.phone || order.address?.phone || "-")}</strong></div>
        <div class="row"><span>Address</span><strong>${esc(address)}</strong></div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Sr No.</th><th>Item Name</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5">No items</td></tr>'}</tbody>
      </table>
    </div>
    <div class="totals-row">
      <div class="invoice-actions">
        <button class="download-btn" type="button" onclick="downloadInvoice()">Download Invoice</button>
      </div>
      <div class="sum">
        <div class="row"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
        ${
          couponDiscount > 0
            ? `<div class="row"><span>Coupon${order.couponCode ? ` (${esc(order.couponCode)})` : ""}</span><strong>-${formatCurrency(couponDiscount)}</strong></div>`
            : ""
        }
        <div class="row"><span>18% GST</span><strong>Included</strong></div>
        <div class="row"><span>Shipping Charges</span><strong>${deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}</strong></div>
        ${order.shippingNonRefundable !== false ? '<div class="row"><span>Shipping policy</span><strong>Non-refundable</strong></div>' : ""}
        <div class="row total"><span>Total Amount</span><strong>${formatCurrency(totalAmount)}</strong></div>
      </div>
    </div>
  </div>
  <script>
    function downloadInvoice() {
      window.focus();
      window.print();
    }
    window.onload = function() { window.focus(); };
  </script>
</body>
</html>`;

  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      URL.revokeObjectURL(url);
      window.alert("Please allow popups for this site to view invoice.");
      return;
    }
    win.addEventListener("load", () => {
      URL.revokeObjectURL(url);
    });
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    console.error("Invoice window render failed:", error);
    window.alert("Unable to open invoice. Please allow popups and try again.");
  }
};
