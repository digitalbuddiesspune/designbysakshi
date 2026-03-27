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

export const openInvoiceWindow = (order, { title = "DesignBySakshi Invoice" } = {}) => {
  if (!order) return;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((sum, it) => sum + (it.quantity || 0) * (it.priceAtOrderTime || 0), 0);
  const deliveryCharge = subtotal > 699 ? 0 : 50;
  const totalAmount = Number(order.totalAmount || subtotal + deliveryCharge);
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
<html>
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)}</title>
  <style>
    body{font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;color:#111827}
    .wrap{max-width:900px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
    .head{background:#1f2d46;color:#fff;padding:18px 20px;text-align:center}
    .head-logo{display:block;width:78px;height:78px;object-fit:contain;margin:0 auto 8px}
    .head h1{margin:0;font-size:28px}
    .head p{margin:6px 0 0;font-size:13px;opacity:.95}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px}
    .box{border:1px solid #e5e7eb;border-radius:10px;padding:12px}
    .box h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;color:#374151}
    .row{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin:6px 0}
    table{width:calc(100% - 36px);margin:0 18px 14px;border-collapse:collapse;font-size:13px}
    th,td{border:1px solid #e5e7eb;padding:8px;text-align:left}
    th{background:#f9fafb}
    .sum{margin:0 18px 20px auto;max-width:320px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
    .sum .row{padding:8px 12px;margin:0}
    .sum .total{background:#1f2d46;color:#fff;font-weight:700}
    @media print{body{background:#fff;padding:0}.wrap{border:none;border-radius:0}.print-btn{display:none}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <img
        class="head-logo"
        src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774441947/Screenshot_2026-03-25_174920-removebg-preview_5_gwltrx.png"
        alt="Design By Sakshi"
      />
      <h1>DesignBySakshi</h1>
      <p>Jewellery Invoice</p>
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
        <div class="row"><span>Address</span><strong style="text-align:right">${esc(address)}</strong></div>
      </div>
    </div>
    <table>
      <thead><tr><th>Sr No.</th><th>Item Name</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5">No items</td></tr>'}</tbody>
    </table>
    <div class="sum">
      <div class="row"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
      <div class="row"><span>18% GST</span><strong>Included</strong></div>
      <div class="row"><span>Delivery Charges</span><strong>${deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}</strong></div>
      <div class="row total"><span>Total Amount</span><strong>${formatCurrency(totalAmount)}</strong></div>
    </div>
  </div>
  <script>window.onload=function(){window.focus();}</script>
</body>
</html>`;

  const win = window.open("about:blank", "_blank");
  if (!win) {
    window.alert("Please allow popups for this site to view invoice.");
    return;
  }
  try {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (error) {
    console.error("Invoice window render failed:", error);
    window.alert("Unable to open invoice. Please allow popups and try again.");
  }
};

