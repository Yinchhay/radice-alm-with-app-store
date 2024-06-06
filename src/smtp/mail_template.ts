export const HTML_TEMPLATE = (
    text: any,
    domain: string = "https://radice.paragoniu.app",
) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <title>Radice Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            width: 100px;
            height: auto;
        }
        .main {
            padding: 20px;
        }
        .main h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #000000;
        }
        .main p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f0f0f0;
            color: #555555;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #555555;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        
        .center {
        	display: grid;
            place-items: center;
		}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Radice</h2>
        </div>
        <div class="main">
            <p>
                ${text}
            </p>
            <div class="center">
            	<a href="${domain}" class="button">Learn More</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Radice. All rights reserved.</p>
            <p>Powered By ParagonIU Cloud</p>
        </div>
    </div>
</body>
</html>
`;
};