require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '乡村基础教育',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 立即测试连接
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❗ 数据库连接失败:', err.message);
    console.log('请检查:');
    console.log('1. MySQL服务是否启动');
    console.log(`2. 用户名密码是否正确 (当前用户: ${process.env.DB_USER || 'root'})`);
    console.log(`3. 数据库是否存在 (当前数据库: ${process.env.DB_NAME || '乡村基础教育'})`);
  } else {
    console.log('✅ 数据库连接成功');
    conn.release();
  }
});

module.exports = pool.promise();