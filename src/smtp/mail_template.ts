export const HTML_TEMPLATE = (text: any) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #192A56;
          color: #ffffff;
          text-align: center;
          padding: 20px 0;
        }
        .content {
          padding: 20px 0;
        }
        .footer {
          background-color: #192A56;
          color: #ffffff;
          text-align: center;
          padding: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Radi Center</h1>
        </div>
        <div class="content">
          <p>${text}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Radi. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>`;
};
